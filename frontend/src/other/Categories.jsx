import { useRestaurant } from "../context/RestaurantContext";
import mainBg from "../assets/main/main_bg.png";

const categories = [
  { name: "All" },
  { name: "Main Course" },
  { name: "Pizza" },
  { name: "Beverages" },
  { name: "Desserts" },
];

export default function Categories() {
  const { activeCategory, setActiveCategory } = useRestaurant();

  return (
    <div>
      <div
  className="h-48 w-full bg-cover bg-center flex flex-col justify-center px-5"
  style={{ backgroundImage: `url(${mainBg})` }}
>
  <h1 className="text-[22px] font-bold text-gray-900 leading-tight font-serif">Our Menu</h1>
  <p className="text-[13px] text-gray-500 mt-1 leading-snug">Delicious food crafted with <br /> the finest ingredients</p>
</div>
      <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 px-4 mt-2">
        {categories.map((item) => {
          const isActive = item.name === activeCategory;

          return (
            <button
              key={item.name}
              onClick={() => setActiveCategory(item.name)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded border bg-white border-[#efeae4]
              `}
            >
              <span className={`text-sm font-medium ${isActive ? "text-[#e03040]" : "text-[#5b5560]"}`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}