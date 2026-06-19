import { Star, Plus, Minus } from "lucide-react";
import { useRestaurant } from "../context/RestaurantContext";

export default function MenuCards() {
  const { filteredMenu, addToCart, removeFromCart, getItemQty } = useRestaurant();

  return (
    <div className="bg-[#fafafa] min-h-screen px-3 py-3 pb-24">
      {filteredMenu.length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-10">No items found.</p>
      )}

      {filteredMenu.map((item) => {
        const qty = getItemQty(item.id);

        return (
          <div key={item.id} className="bg-white rounded mb-3 flex gap-3 p-3 ">

            <div className="relative shrink-0 w-30 h-25">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded"/>
            </div>


            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <p className="text-[13.5px] font-semibold text-gray-900 leading-snug truncate">
                  {item.name}
                </p>
                <p className="text-[11px] text-gray-400 leading-snug mt-0.5 line-clamp-2">
                  {item.description}
                </p>
              </div>







              <div className="flex items-center justify-between mt-2">
                <span className="text-[14px] font-bold text-gray-900">₹{item.price}</span>

                {qty === 0 ? (
                  <button
                    onClick={() => addToCart(item)}
                    className="flex items-center gap-1 border border-[#e03040] text-[#e03040] text-[12px] font-semibold px-3 py-1 rounded active:scale-95 transition-transform">
                    <Plus size={13} />
                    Add
                  </button>
                ) : (
                  <div className="flex items-center gap-2 border border-[#e03040] rounded px-2 py-1">
                    <button onClick={() => removeFromCart(item.id)}>
                      <Minus size={13} className="text-[#e03040] rounded" />
                    </button>
                    <span className="text-[13px] font-bold text-[#e03040] min-w-4 text-center rounded">{qty}</span>
                    <button onClick={() => addToCart(item)}>
                      <Plus size={13} className="text-[#e03040] rounded" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}