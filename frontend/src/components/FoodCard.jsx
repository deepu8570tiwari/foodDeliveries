import React, { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import {
  FaDrumstickBite,
  FaLeaf,
  FaMinus,
  FaPlus,
  FaRegStar,
  FaStar,
} from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setAddToCart } from "../redux/userSlice";

function FoodCard({ data }) {
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();

  // ❌ WRONG: const {cartItems} = useSelector(...)
  // ✅ RIGHT:
  const cartItems = useSelector((state) => state.user.cartItems);

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) =>
      i < rating ? (
        <FaStar key={i} className="text-yellow-500 text-lg" />
      ) : (
        <FaRegStar key={i} className="text-yellow-500 text-lg" />
      )
    );

  const handleIncreaseQuantity = () => setQuantity(quantity + 1);
  const handleDecreaseQuantity = () =>
    quantity > 0 && setQuantity(quantity - 1);

  return (
    <div className="w-[250px] rounded-2xl border-2 border-[#ff4d2d] bg-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="relative w-full h-[170px] flex justify-center items-center bg-white">
        <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow">
          {data.foodType === "veg" ? (
            <FaLeaf className="text-green-600 text-lg" />
          ) : (
            <FaDrumstickBite className="text-red-600 text-lg" />
          )}
        </div>
        <img
          src={data.image}
          alt=""
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex-1 flex flex-col p-4">
        <h1 className="font-semibold text-gray-900 text-base truncate">
          {data.name}
        </h1>
        <div className="flex items-center gap-1 mt-1">
          {renderStars(data.rating?.average || 0)}
          <span className="text-xs text-gray-500">{data.rating?.count || 0}</span>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 mt-auto">
        <span className="font-bold text-gray-900 text-lg">₹{data.price}</span>

        <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
          <button
            className="px-2 py-1 hover:bg-gray-100 transition"
            onClick={handleDecreaseQuantity}
          >
            <FaMinus size={12} />
          </button>

          <span className="px-2">{quantity}</span>

          <button
            className="px-2 py-1 hover:bg-gray-100 transition"
            onClick={handleIncreaseQuantity}
          >
            <FaPlus size={12} />
          </button>

          {/* ADD TO CART button */}
          <button
            className={`${
              cartItems.some((i) => i.id === data._id)
                ? "bg-gray-800"
                : "bg-[#ff4d2d]"
            } text-white px-3 py-2 transition-colors rounded-lg`}
            onClick={() =>{quantity>0 ?
              dispatch(
                setAddToCart({
                  id: data._id,
                  name: data.name,
                  price: data.price,
                  image: data.image,
                  shop: data.shop,
                  quantity,
                  foodType: data.foodType,
                })
              ):null
              }
            }
          >
            {cartItems.some((i) => i.id === data._id) ? (
              <FaShoppingCart size={16} />
            ) : (
              <FaShoppingCart size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
