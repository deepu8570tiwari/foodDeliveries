import React, { useEffect, useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { IoSearch, IoClose } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { userServiceUrl } from '../App';
import { setSearchItems, setUserData } from '../redux/userSlice';
import { setMyShopData } from '../redux/ownerSlice';
import axios from 'axios';
import { FaPlus } from "react-icons/fa";
import { TbReceipt2 } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
function Nav() {
  const { userData, city,cartItems } = useSelector(state => state.user);
  const { myShopData } = useSelector(state => state.owner);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showDesktopSearch, setShowDesktopSearch] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [query,setQuery]=useState("");
  const handleLogout=async()=>{
    try {
      const result=await axios.get(`${userServiceUrl}/api/v1/signout`,
        {withCredentials:true}
      )
      dispatch(setUserData(null))
    } catch (error) {
      console.log(error)
    }
  }
  const handleSearchItems=async()=>{
    console.log(`${userServiceUrl}/api/v1/category/search-items?query=${query}&city=${city}`);
    try {
      const result=await axios.get(`${userServiceUrl}/api/v1/category/search-items?query=${query}&city=${city}`,{ withCredentials: true })
      console.log("searchItems",result)
      dispatch(setSearchItems(result.data))
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    if(query){
      handleSearchItems()
    }else{
      dispatch(setSearchItems(null))
    }
  },[query])
  return (
    <div className="w-full h-20 flex items-center justify-between md:justify-center gap-[30px] px-5 fixed top-0 z-9999 bg-[#fff9f6]">
      {/* MOBILE SEARCH BAR */}
      {showMobileSearch && userData.data.roles=="user" && (
        <div className="w-[90%] h-[70px] bg-white shadow-xl rounded-lg flex items-center gap-5 md:hidden fixed top-20 left-[5%]">
          
          {/* Location */}
          <div className="flex items-center w-[30%] gap-2.5 px-2.5 border-r-2 border-gray-400">
            <FaLocationDot size={25} className="text-[#ff4d2d]" />
            <div className="w-[80%] truncate text-gray-600">{city}</div>
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
              onChange={(e)=>setQuery(e.target.value)} value={query}
            />
          </div>

        </div>
      )}

      {/* LEFT → Brand Name & Mobile Search Icon */}
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-[#ff4d2d]">Zigato</h1>
      </div>

      {/* DESKTOP SEARCH BAR */}
      {userData.data.roles=="user" && (
      <div className="md:w-[60%] lg-w-[40%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-5 hidden md:flex">

        {/* Location */}
        <div className="flex items-center w-[30%] gap-2.5 px-2.5 border-r-2 border-gray-400">
          <FaLocationDot size={25} className="text-[#ff4d2d]" />
          <div className="w-[80%] truncate text-gray-600">{city}</div>
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
            onChange={(e)=>setQuery(e.target.value)} value={query}
          />
        </div>
      </div>
      )}
      {/* RIGHT → Cart, Orders, User Profile */}
      <div className="flex items-center gap-4">
       {userData.data.roles=="user" && (
          <IoSearch
            size={25}
            className="text-[#ff4d2d] cursor-pointer md:hidden right-2"
            onClick={() => setShowMobileSearch(true)}
          />
        )
        }
        {userData.data.roles=="owner" ?<>
          {myShopData && <>
          <button onClick={()=>navigate("/add-items")} className='hidden md:flex items-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]'>
          <FaPlus size={20}/>
          <span>Add Food Items</span>
          </button>
          <button onClick={()=>navigate("/add-items")} className='md:hidden flex items-center p-2 cursor-pointer  rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]'>
          <FaPlus size={20}/>
          </button>
          
          </>}

          <div onClick={()=>navigate('/my-orders')} className=' hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium'>
            <TbReceipt2 size={20}/>
            <span>My Orders 1</span>
            <span className='absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-1.5 py-px'>0</span>
          </div>
          <div onClick={()=>navigate('/my-orders')} className='md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium'>
            <TbReceipt2 size={20}/>
            <span className='absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-1.5 py-px'>0</span>
          </div>
        </>:(<>
        {userData.data.roles=="user" && 
        <div className="relative cursor-pointer" onClick={()=>navigate('/cart')}>
          <FiShoppingCart size={25} className="text-[#ff4d2d]" />
          <span className="absolute right-[-9px] -top-3 text-[#ff4d2d]">{cartItems.length}</span>
        </div>
        }
        <button onClick={()=>navigate("/my-orders")} className=" cursor-pointer hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium">
          My Orders
        </button></>)
        }
        {/* Cart */}
        
        
        {/* User Avatar */}
        <div
          onClick={() => setShowInfo(prev => !prev)}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer"
        >
          {userData?.data.fullname.slice(0, 1)}
        </div>

        {/* User Info Dropdown */}
        {showInfo && (
          <div className={`fixed top-20 right-2.5 ${userData.data.roles==="delivery" ?"md:right-[20%] lg:right-[40%]" :"md:right-[10%] lg:right-[25%]"} w-[180px] bg-white shadow-2xl p-5 flex flex-col gap-2.5 z-9999`}>
            <div className="text-[17px] font-semibold">
              {userData?.data.fullname}
            </div>
            {userData?.data.roles=="user" && (
              <div  onClick={()=>navigate("/my-orders")}className="md:hidden text-[#ff4d2d] font-semibold cursor-pointer">
              My Orders
            </div>
            )}
            

            <div className="text-[17px] text-[#ff4d2d] font-semibold cursor-pointer" onClick={handleLogout}>
              Log Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Nav;
