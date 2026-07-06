import { User, Phone } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function Logins() {
  const [name, setname] = useState("");
  const [number, setnumber] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post(`http://localhost:8000/table/customer/${token}`, {
        name,
        phone: number,
      });

      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed", error);
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
            Welcome
          </h1>

          <p className="mt-3 text-gray-500 leading-relaxed">
            Enter your details to start
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

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-[#16213E]">
              Full Name
            </label>

            <div className="mt-2 flex items-center h-14 rounded-2xl bg-white border border-gray-200 px-4 shadow-sm">
              <User size={20} className="text-[#E53946]" />

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                className="ml-3 flex-1 outline-none bg-transparent placeholder:text-gray-400"
                onChange={(e) => setname(e.target.value)}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-[#16213E]">
              Phone Number
            </label>

            <div className="mt-2 flex items-center h-14 rounded-2xl bg-white border border-gray-200 px-4 shadow-sm">
              <Phone size={20} className="text-[#E53946]" />

              <span className="mx-3 text-gray-400">
                +91
              </span>

              <input
                value={number}
                onChange={(e) => setnumber(e.target.value)}
                type="tel"
                maxLength={10}
                placeholder="9876543210"
                className="flex-1 outline-none bg-transparent placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Continue */}
          <button
            type="submit"
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
            "
          >
            Start Ordering
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8 leading-relaxed">
          Your information is only used to identify
          <br />
          your order during this visit.
        </p>
      </div>
    </div>
  );
}