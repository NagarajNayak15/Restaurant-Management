import { AlertCircle, RefreshCcw, PhoneCall } from "lucide-react";

export default function TableUnavailable() {
  return (
    <div className="min-h-screen bg-[#FCFBFA] relative overflow-hidden flex items-center">

      {/* Background Decorations */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#FCEBE8] opacity-70" />
      <div className="absolute bottom-0 -left-24 w-60 h-60 rounded-full bg-[#FCEBE8] opacity-60" />
      <div className="absolute top-40 right-8 w-20 h-20 border border-[#F4D4CF] rounded-full" />

      <div className="relative z-10 px-6 w-full">

        {/* Illustration */}
        <div className="flex justify-center">
          <div className="w-28 h-28 rounded-full bg-white shadow-lg flex items-center justify-center">
            <AlertCircle
              size={52}
              className="text-[#E53946]"
            />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mt-8">

          <h1 className="text-4xl font-serif font-bold text-[#16213E]">
            Table Unavailable
          </h1>

          <p className="mt-4 text-gray-500 leading-relaxed">
            We're sorry, this table is currently
            unavailable for online ordering.
          </p>

          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            The QR code may have expired,
            the table may be inactive,
            or it is currently unavailable.
          </p>

        </div>

        {/* Buttons */}
        <div className="mt-12 space-y-4">

          <button
            onClick={()=>{window.location.reload()}}
            className="
              w-full
              h-14
              rounded-2xl
              bg-[#E53946]
              text-white
              font-semibold
              shadow-lg
              shadow-red-200
              flex
              items-center
              justify-center
              gap-2
              active:scale-95
              transition
            "
          >
            <RefreshCcw size={18} />
            Try Again
          </button>

          <button
            className="
              w-full
              h-14
              rounded-2xl
              border
              border-gray-200
              bg-white
              text-[#16213E]
              font-semibold
              flex
              items-center
              justify-center
              gap-2
              active:scale-95
              transition
            "
          >
            <PhoneCall size={18} />
            Contact Staff
          </button>

        </div>

        {/* Footer */}
        <div className="mt-10 text-center">

          <p className="text-sm text-gray-400">
            Need assistance?
          </p>

          <p className="text-[#16213E] font-medium mt-1">
            Our staff will be happy to help you.
          </p>

        </div>

      </div>

    </div>
  );
}