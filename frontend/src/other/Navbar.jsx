import logo from "../assets/main/logo.png";
import { useRestaurant } from "../context/RestaurantContext";
import { UtensilsCrossed } from "lucide-react";

const Navbar = () => {
  const { tableNumber } = useRestaurant();
  const storedTableNumber = Number(localStorage.getItem("tableNumber"));
  const displayedTableNumber = Number.isInteger(storedTableNumber) && storedTableNumber > 0
    ? storedTableNumber
    : tableNumber;
  return (
    <nav className="flex items-center justify-between  sticky top-0 z-50  px-4 h-14 bg-white shadow-[0_1px_0_#f0ede8]">
        <a href="/">
        <img src={logo} alt="Logo" className="h-8 object-contain" />
      </a>

      <div className='flex items-center justify-between gap-1 border border-gray-300 px-2.5 py-1.5 rounded'>
        <UtensilsCrossed size={12} className="text-gray-600" />
        <span className="font-medium">Table {displayedTableNumber ?? "—"}</span>
      </div>

      
    </nav>
  )
}

export default Navbar
