import React, { useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import { categories } from "../Category";
import CategoryCard from "./CategoryCard";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";
import { useNavigate } from "react-router-dom";
import { userServiceUrl } from "../App";
function UserDashboard() {
  const catScrollRef = useRef(null);
  const shopScrollRef = useRef(null);
  const navigate=useNavigate();
  const scrollLeftCat = () => catScrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRightCat = () => catScrollRef.current.scrollBy({ left: 300, behavior: "smooth" });

  const scrollLeftShop = () => shopScrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRightShop = () => shopScrollRef.current.scrollBy({ left: 300, behavior: "smooth" });

  const { city, shopInMyCity, itemInMyCity,searchItems } = useSelector(state => state.user);
  const [updatedItemsList, setUpdatedItemsList] = useState([]);

  const handleFilterCategory = (category) => {
    if (category === "All") {
      setUpdatedItemsList(itemInMyCity);
    } else {
      const filterList = itemInMyCity?.filter(i => i.category === category);
      setUpdatedItemsList(filterList);
    }
  };
  
  useEffect(() => {
    setUpdatedItemsList(itemInMyCity);
  }, [itemInMyCity]);

  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col items-center">
      <Nav />
      {searchItems && searchItems.length>0 &&(
        <div className="w-full max-w-6xl flex flex-col gap-5 items-start bg-[#fff9f6] overflow-y-auto mt-10">
          <h1 className="text-gray-900 text-2xl sm:text-3xl font-semibold border-b border-gray-200 pb-2">Search Result</h1>
          <div className="w-full h-auto flex flex-wrap gap-6 justify-center">
            {searchItems.map((item)=>(
              <FoodCard data={item} key={item._id}/>
            ))}
          </div>
        </div>
      )}
      {/* Category Slider */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-5">
        <h1 className="text-xl font-semibold text-gray-800">
          Inspiration for your first Orders
        </h1>

        <div className="relative w-full">
          <button onClick={scrollLeftCat} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg w-10 h-10 rounded-full flex items-center justify-center">
            <FaChevronCircleLeft size={20} />
          </button>

          <div ref={catScrollRef} className="cursor-pointer w-full flex overflow-x-auto gap-4 pb-2 scroll-smooth scrollbar-none">
            {categories.map((cat, index) => (
              <CategoryCard
                key={index}
                name={cat.category}
                image={cat.image}
                onClick={() => handleFilterCategory(cat.category)}
              />
            ))}
          </div>

          <button onClick={scrollRightCat} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg w-10 h-10 rounded-full flex items-center justify-center">
            <FaChevronCircleRight size={20} />
          </button>
        </div>
      </div>

      {/* Shop Slider */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-2.5">
        <h1 className="text-xl font-semibold text-gray-800">
          Best Shop in Your Area {city}
        </h1>

        <div className="relative w-full">
          <button onClick={scrollLeftShop} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg w-10 h-10 rounded-full flex items-center justify-center">
            <FaChevronCircleLeft size={20} />
          </button>

          <div ref={shopScrollRef} className="w-full flex overflow-x-auto gap-4 pb-2 scroll-smooth scrollbar-none cursor-pointer">
            {shopInMyCity?.map((shop, index) => (
              <CategoryCard key={index} name={shop.name} image={shop.image} onClick={()=>navigate(`shop/${shop._id}`)}/>
            ))}
          </div>

          <button onClick={scrollRightShop} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg w-10 h-10 rounded-full flex items-center justify-center">
            <FaChevronCircleRight size={20} />
          </button>
        </div>
      </div>

      {/* Food Items */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-2.5">
        <h1 className="text-xl font-semibold text-gray-800">
          Suggested Food Items
        </h1>

        <div className="w-full h-auto flex flex-wrap gap-5 justify-center">
          {updatedItemsList?.map((item, index) => (
            <FoodCard key={index} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
