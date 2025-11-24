import React, { useRef } from "react";
import Nav from "../components/Nav";
import { categories } from "../Category";
import CategoryCard from "./CategoryCard";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { setUserData,setShopInMyCity } from '../redux/userSlice';

function UserDashboard() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };
  const {city,shopInMyCity}=useSelector(state=>state.user);
  console.log("setShopInMyCity",shopInMyCity);
  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col items-center">
      <Nav />

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-5">
        <h1 className="text-xl font-semibold text-gray-800">
          Inspiration for your first Orders
        </h1>

        <div className="relative w-full">

          {/* Left Scroll Button */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10
              bg-white shadow-lg w-10 h-10 flex items-center justify-center
              rounded-full hover:bg-gray-100 transition"
          >
            <FaChevronCircleLeft size={20} />
          </button>

          {/* Scrollable Category Row */}
          <div
            ref={scrollRef}
            className="w-full flex overflow-x-auto gap-4 pb-2 scroll-smooth
              scrollbar-none"
          >
            {categories.map((cat, index) => (
              <CategoryCard name={cat.category} image={cat.image} key={index} />
            ))}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10
              bg-white shadow-lg w-10 h-10 flex items-center justify-center
              rounded-full hover:bg-gray-100 transition"
          >
            <FaChevronCircleRight size={20} />
          </button>

        </div>
      </div>
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-2.5">
          <h1 className="text-xl font-semibold text-gray-800">
          Best Shop in Your Area {city} </h1>
          <div className="relative w-full">

          {/* Left Scroll Button */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10
              bg-white shadow-lg w-10 h-10 flex items-center justify-center
              rounded-full hover:bg-gray-100 transition"
          >
            <FaChevronCircleLeft size={20} />
          </button>

          {/* Scrollable Category Row */}
          <div
            ref={scrollRef}
            className="w-full flex overflow-x-auto gap-4 pb-2 scroll-smooth
              scrollbar-none"
          >
            {shopInMyCity?.map((shop, index) => (
              <CategoryCard name={shop.name} image={shop.image}key={index} />
            ))}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10
              bg-white shadow-lg w-10 h-10 flex items-center justify-center
              rounded-full hover:bg-gray-100 transition"
          >
            <FaChevronCircleRight size={20} />
          </button>

        </div>
      </div>
      
    </div>
  );
}

export default UserDashboard;
