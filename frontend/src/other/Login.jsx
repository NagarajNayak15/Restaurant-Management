import { User, Phone } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRestaurant } from "../context/RestaurantContext";

export default function Logins({ qrToken, qrTableNumber }) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [needsName, setNeedsName] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setTableNumber } = useRestaurant();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (needsName && !name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`http://localhost:8000/table/customer/${qrToken}`, {
        phone: number,
        ...(needsName ? { name } : {}),
      });

      if (response.data.needsName) {
        setNeedsName(true);
        return;
      }

      if (response.data.token) {
        let tableNumber = response.data.tableNumber ?? qrTableNumber;
        if (!Number.isInteger(tableNumber) || tableNumber < 1) {
          const { data } = await axios.get(`http://localhost:8000/table/available/${qrToken}`);
          tableNumber = data.tableNumber;
        }

        if (!Number.isInteger(tableNumber) || tableNumber < 1) {
          throw new Error("We couldn't identify your table. Please scan its QR code again.");
        }

        localStorage.setItem("token", response.data.token);
        setTableNumber(tableNumber);
        navigate("/");
        return;
      }

      throw new Error("The server returned an unexpected login response.");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || error.message || "We couldn't sign you in. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBFA] relative overflow-hidden flex items-center">
      {/* Background Decorations */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#FCEBE8] opacity-70" />
      <div className="absolute bottom-0 -left-20 w-52 h-52 rounded-full bg-[#FCEBE8] opacity-60" />
      <div className="absolute top-40 right-6 w-16 h-16 border border-[#F4D4CF] rounded-full" />
      <div className="absolute bottom-44 left-6 w-8 h-8 bg-[#E53946]/10 rounded-full" />

      <div className="relative z-10 w-full px-6">

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-bold text-[#16213E]">
            {needsName ? "Almost there" : "Welcome"}
          </h1>

          <p className="mt-3 text-gray-500 leading-relaxed">
            {needsName ? "Tell us your name to create your account." : "Enter your phone number to start"}
            <br />
            your dining experience.
          </p>

          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"
            alt="Food"
            className="w-60 h-60 object-cover rounded-full mx-auto mt-8 shadow-2xl"
          />
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {needsName && (
            <div>
              <label htmlFor="customer-name" className="text-sm font-medium text-[#16213E]">
                Full Name
              </label>

              <div className="mt-2 flex items-center h-14 rounded-2xl bg-white border border-gray-200 px-4 shadow-sm">
                <User size={20} className="text-[#E53946]" />

                <input
                  id="customer-name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  required
                  maxLength={100}
                  autoComplete="name"
                  className="ml-3 flex-1 outline-none bg-transparent placeholder:text-gray-400"
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
            </div>
          )}

          {/* Phone */}
          <div>
            <label htmlFor="customer-phone" className="text-sm font-medium text-[#16213E]">
              Phone Number
            </label>

            <div className="mt-2 flex items-center h-14 rounded-2xl bg-white border border-gray-200 px-4 shadow-sm">
              <Phone size={20} className="text-[#E53946]" />

              <span className="mx-3 text-gray-400">
                +91
              </span>

              <input
                id="customer-phone"
                value={number}
                onChange={(event) => setNumber(event.target.value.replace(/\D/g, "").slice(0, 10))}
                type="tel"
                maxLength={10}
                inputMode="numeric"
                autoComplete="tel-national"
                required
                placeholder="9876543210"
                className="flex-1 outline-none bg-transparent placeholder:text-gray-400"
                readOnly={needsName}
              />
            </div>
          </div>

          {errorMessage && (
            <p role="alert" className="text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          {/* Continue */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              w-full
              h-14
              mt-4
              rounded-2xl
              bg-[#E53946]
              text-white
              font-semibold
              shadow-lg
              shadow-red-200
              active:scale-95
              transition
              disabled:cursor-not-allowed
              disabled:opacity-70
            "
          >
            {isSubmitting ? "Please wait..." : needsName ? "Create Account" : "Continue"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8 leading-relaxed">
          Your phone number helps us identify your order.
        </p>
      </div>
    </div>
  );
}