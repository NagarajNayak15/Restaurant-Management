import { useRestaurant } from "../context/RestaurantContext";
import mainBg from "../assets/main/main_bg.png";

export default function Categories() {
  const { activeCategory, setActiveCategory, categories, dietFilter, setDietFilter } = useRestaurant();

  return (
    <div>
      <div
        className="h-48 w-full bg-cover bg-center flex flex-col justify-center px-5"
        style={{ backgroundImage: `url(${mainBg})` }}
      >
        <h1 className="text-[22px] font-bold text-gray-900 leading-tight font-serif">Our Menu</h1>
        <p className="text-[13px] text-gray-500 mt-1 leading-snug">Delicious food crafted with <br /> the finest ingredients</p>
      </div>

      <div className="flex gap-2 px-4 mt-3">
        <button
          onClick={() => setDietFilter((prev) => (prev === "veg" ? "all" : "veg"))}
          className={`flex-shrink-0 px-3 py-2 rounded-full text-sm font-medium border ${
            dietFilter === "veg" ? "bg-[#e03040] text-white border-[#e03040]" : "bg-white text-[#5b5560] border-[#efeae4]"
          }`}
        >
          Only Veg
        </button>
        <button
          onClick={() => setDietFilter((prev) => (prev === "nonveg" ? "all" : "nonveg"))}
          className={`flex-shrink-0 px-3 py-2 rounded-full text-sm font-medium border ${
            dietFilter === "nonveg" ? "bg-[#e03040] text-white border-[#e03040]" : "bg-white text-[#5b5560] border-[#efeae4]"
          }`}
        >
          Only Non-Veg
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 px-4 mt-2">
        {categories.map((item) => {
          const isActive = item.value === activeCategory;

          return (
            <button
              key={item.value}
              onClick={() => setActiveCategory(item.value)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded border bg-white border-[#efeae4]`}
            >
              <span className={`text-sm font-medium ${isActive ? "text-[#e03040]" : "text-[#5b5560]"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}