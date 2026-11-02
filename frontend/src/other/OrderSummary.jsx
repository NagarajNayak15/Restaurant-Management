import mainBg from "../assets/main/main_bg.png";
import { useRestaurant } from '../context/RestaurantContext';
import { Plus, Minus, Trash2 } from 'lucide-react';

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

const OrderSummary = () => {
const { addToCart, removeFromCart, cartItems, cartCount, cartTotal } = useRestaurant();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);
  const taxes = Number((cartTotal * 0.1).toFixed(2));
  const total = cartTotal + taxes;

  const navigate = useNavigate();

  useEffect(() => {
    if (cartCount === 0 && !placedOrder) {
      navigate("/");
    }
  }, [cartCount, navigate, placedOrder]);

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSubmitError("Your dining session has expired. Please scan the table QR code and start again.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch(`${API_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          orderType: "dine",
          paymentMode: "cash",
          items: cartItems.map((item) => ({
            menuItemId: item.id,
            quantity: item.qty,
          })),
        }),
      });

      const result = await response.json();
      if (response.status === 401) {
        localStorage.removeItem("token");
        const qrToken = localStorage.getItem("customerQrToken");
        if (qrToken) {
          navigate(`/login/${encodeURIComponent(qrToken)}`, { replace: true });
          return;
        }
      }

      if (!response.ok) {
        throw new Error(result.message || "Could not place your order.");
      }

      setPlacedOrder(result);
      cartItems.forEach((item) => removeFromCart(item.id, true));
    } catch (error) {
      setSubmitError(error.message || "Could not place your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="min-h-screen bg-[#fafafa] px-4 py-20">
        <div className="mx-auto max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-green-700">Order placed!</h1>
          <p className="mt-3 text-gray-600">
            Your order #{placedOrder.orderNumber ?? placedOrder.id?.slice(0, 8)} has been sent to the restaurant.
          </p>
          <p className="mt-2 font-semibold">Total: ₹{Number(placedOrder.totalAmount || total).toFixed(2)}</p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 rounded bg-[#e03040] px-5 py-3 font-semibold text-white"
          >
            Back to menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className="h-48 w-full bg-cover bg-center flex flex-col justify-center px-5"
        style={{ backgroundImage: `url(${mainBg})` }}
      >
        <h1 className="text-[22px] font-bold text-gray-900 leading-tight font-serif">Checkout</h1>
        <p className="text-[13px] text-gray-500 mt-1 leading-snug">Review your order<br /> and place it</p>
      </div>

      <div className='bg-[#fafafa] min-h-screen py-3 pb-24 px-4 mt-2'>
        {submitError && (
          <p role="alert" className="mb-3 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {submitError}
          </p>
        )}
        <div className="flex items-center justify-between mt-2 mb-3">
          <h2 className='font-semibold'>Order Summary</h2>
          <h3 className="border border-[#e03040] text-[#e03040] text-[12px] font-semibold px-3 py-1 rounded">{cartCount} items </h3>
        </div>

        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-100">
            <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />

            <div className="flex-1">
              <p className="text-[14px] font-medium">{item.name}</p>
              <p className="text-[13px] font-semibold text-green-600">₹{item.price}</p>
            </div>

            <button onClick={() => removeFromCart(item.id)}><Minus size={16} /></button>
            <span className="text-[13px] w-4 text-center">{item.qty}</span>
            <button onClick={() => addToCart(item)}><Plus size={16} /></button>

            <button onClick={() => removeFromCart(item.id, true)} className="ml-2 text-gray-400">
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-[13px] text-gray-500">
            <span>Subtotal</span>
            <span>₹{cartTotal}</span>
          </div>
          <div className="flex justify-between text-[13px] text-gray-500">
            <span>Taxes & Charges</span>
            <span>₹{taxes}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-[18px] text-green-600">₹{total}</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-[12px] text-gray-500">Total Payable</p>
          <p className="text-[16px] font-bold text-green-600">₹{total}</p>
        </div>

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={isSubmitting || cartItems.length === 0}
          className="flex-1 max-w-[200px] bg-[#e03040] text-white font-semibold text-[14px] py-3 rounded disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Placing order..." : "Place Order"}
        </button>
      </div>
    </div>
  )
}

export default OrderSummary