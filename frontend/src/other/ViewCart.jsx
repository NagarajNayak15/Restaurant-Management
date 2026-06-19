import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRestaurant } from "../context/RestaurantContext";

const ViewCart=()=> {
  const { cartCount, cartTotal } = useRestaurant();
  const navigate = useNavigate();

  if (cartCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-3 right-3 z-50">
      <button
        onClick={() => navigate("/checkout")}
        className="w-full bg-[#e03040] text-white flex items-center justify-between px-4 py-3 rounded active:scale-[0.98] transition-transform "
      >
        <span className="text-[14px] font-semibold w-full">View Cart</span>
      </button> 
    </div>
  );
}

export default ViewCart