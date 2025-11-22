import React, { useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { IoSearch, IoClose } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { useSelector } from "react-redux";

function Nav() {
  const { userData } = useSelector(state => state.user);

  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showDesktopSearch, setShowDesktopSearch] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="w-full h-20 flex items-center justify-between md:justify-center gap-[30px] px-5 fixed top-0 z-[9999] bg-[#fff9f6]">

      {/* MOBILE SEARCH BAR */}
      {showMobileSearch && (
        <div className="w-[90%] h-[70px] bg-white shadow-xl rounded-lg flex items-center gap-5 md:hidden fixed top-20 left-[5%]">
          
          {/* Location */}
          <div className="flex items-center w-[30%] gap-2.5 px-2.5 border-r-2 border-gray-400">
            <FaLocationDot size={25} className="text-[#ff4d2d]" />
            <div className="w-[80%] truncate text-gray-600">Jhansi</div>
          </div>

          {/* Search Box */}
          <div className="w-[80%] flex items-center gap-2.5">
            <IoClose
              size={28}
              className="text-[#ff4d2d] cursor-pointer right-1"
              onClick={() => setShowMobileSearch(false)}
            />
            <input
              type="text"
              placeholder="Search delicious food"
              className="px-2.5 text-gray-700 outline-none w-full"
            />
          </div>

        </div>
      )}

      {/* LEFT → Brand Name & Mobile Search Icon */}
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-[#ff4d2d]">Zigato</h1>
      </div>

      {/* DESKTOP SEARCH BAR */}
      <div className="md:w-[60%] lg-w-[40%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-5 hidden md:flex">

        {/* Location */}
        <div className="flex items-center w-[30%] gap-2.5 px-2.5 border-r-2 border-gray-400">
          <FaLocationDot size={25} className="text-[#ff4d2d]" />
          <div className="w-[80%] truncate text-gray-600">Jhansi</div>
        </div>

        {/* Search + Input */}
        <div className="w-[80%] flex items-center gap-2.5">
          {showDesktopSearch ? (
            <IoClose
              size={25}
              className="text-[#ff4d2d] cursor-pointer"
              onClick={() => setShowDesktopSearch(false)}
            />
          ) : (
            <IoSearch
              size={25}
              className="text-[#ff4d2d] cursor-pointer"
              onClick={() => setShowDesktopSearch(true)}
            />
          )}

          <input
            type="text"
            placeholder="Search delicious food"
            className="px-2.5 text-gray-700 outline-none w-full"
          />
        </div>
      </div>

      {/* RIGHT → Cart, Orders, User Profile */}
      <div className="flex items-center gap-4">
        <IoSearch
          size={25}
          className="text-[#ff4d2d] cursor-pointer md:hidden right-2"
          onClick={() => setShowMobileSearch(true)}
        />
        {/* Cart */}
        <div className="relative cursor-pointer">
          <FiShoppingCart size={25} className="text-[#ff4d2d]" />
          <span className="absolute right-[-9px] -top-3 text-[#ff4d2d]">0</span>
        </div>

        {/* My Orders Button (Desktop Only) */}
        <button className="hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium">
          My Orders
        </button>

        {/* User Avatar */}
        <div
          onClick={() => setShowInfo(prev => !prev)}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer"
        >
          {userData?.data.fullname.slice(0, 1)}
        </div>

        {/* User Info Dropdown */}
        {showInfo && (
          <div className="fixed top-20 right-2.5 md:right-[10%] lg:right-[13%] w-[180px] bg-white shadow-2xl p-5 flex flex-col gap-2.5 z-[9999]">
            <div className="text-[17px] font-semibold">
              {userData?.data.fullname}
            </div>

            <div className="md:hidden text-[#ff4d2d] font-semibold cursor-pointer">
              My Orders
            </div>

            <div className="text-[17px] text-[#ff4d2d] font-semibold cursor-pointer">
              Log Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Nav;
