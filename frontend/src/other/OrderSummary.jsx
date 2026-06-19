import React from 'react'
import mainBg from "../assets/main/main_bg.png";
import { useRestaurant } from '../context/RestaurantContext';
import { Plus, Minus, Trash2 } from 'lucide-react';

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrderSummary = () => {
  const { addToCart, removeFromCart, cart, cartCount, cartTotal } = useRestaurant();

  const taxes = Math.round(cartTotal * 0.075);
  const total = cartTotal + taxes;

  const navigate = useNavigate();

  useEffect(() => {
    if (cartCount === 0) {
      navigate("/");
    }
  }, [cartCount, navigate]);

  const handlePlaceOrder = () => {
   
  };

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
        <div className="flex items-center justify-between mt-2 mb-3">
          <h2 className='font-semibold'>Order Summary</h2>
          <h3 className="border border-[#e03040] text-[#e03040] text-[12px] font-semibold px-3 py-1 rounded">{cartCount} items </h3>
        </div>

        {cart.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-100">
            <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />

            <div className="flex-1">
              <p className="text-[14px] font-medium">{item.name}</p>
              <p className="text-[13px] font-semibold text-green-600">₹{item.price}</p>
            </div>

            <button onClick={() => removeFromCart(item.id)}><Minus size={16} /></button>
            <span className="text-[13px] w-4 text-center">{item.qty}</span>
            <button onClick={() => addToCart(item)}><Plus size={16} /></button>

            <button onClick={() => removeFromCart(item.id, item.qty)} className="ml-2 text-gray-400">
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
          onClick={handlePlaceOrder}
          className="flex-1 max-w-[200px] bg-[#e03040] text-white font-semibold text-[14px] py-3 rounded"
        >
          Place Order
        </button>
      </div>
    </div>
  )
}

export default OrderSummary