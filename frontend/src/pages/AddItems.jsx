import React, { useState } from 'react'
import { FaUtensils } from 'react-icons/fa6';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { userServiceUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import axios from 'axios';

function AddItems() {
  const navigate=useNavigate();
  const {myShopData}=useSelector(state=>state.owner);
  const [name,setName]=useState("");
  const [price,setPrice]=useState(0);
  const categories=["Snacks","Main Course","Desserts","Pizza","Burgers","Sandwiches","South Indian","North Indian","Chinese","Fast Food","Others"];
  const [category,setCategory]=useState("");
  const [foodType,setFoodType]=useState("veg");
  const [shopimage,setShopImage]=useState("");
  const [sentimage,setSentImage]=useState(null);
  const dispatch = useDispatch();
  const handleImage=(e)=>{
    const file=e.target.files[0];
    setSentImage(file);
    setShopImage(URL.createObjectURL(file));
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    
    try {
      const formData=new FormData();
      formData.append("name", name);
      if(sentimage){
        formData.append("image",sentimage)
      }
      console.log(`${userServiceUrl}/api/v1/shop/create`);
     const result = await axios.post(
        `${userServiceUrl}/api/v1/shop/create`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        }
      );
      console.log(result.data);
      dispatch(setMyShopData(result.data));
    } catch (error) {
      
    }
  }
  return (
    <div className='flex justify-center flex-col  items-center p-6 bg-linear-to-br from-orange-50 relative to-white min-h-screen'>
      <div className='absolute top-5 left-5 z-10 mb-2.5 cursor-pointer' onClick={()=>navigate("/")}>
        <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]'/>
      </div>
      <div className='max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100'>
        <div className='flex flex-col items-center mb-6'>
          <div className='bg-orange-100 p-4 rounded-full mb-4'>
            <FaUtensils className='text-[#ff4d2d] w-16 h-16'/>
          </div>
          <div className='text-3xl font-extrabold text-gray-900'>
            Add Food Items
          </div>
        </div>
        <form className='space-y-5' onSubmit={handleSubmit} enctype="multipart/form-data">
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
              <input type="text" placeholder='Enter Shop Name' onChange={(e)=>setName(e.target.value)}  value={name} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500'/>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Food Image</label>
              <input type="file" accept="image/*"  onChange={handleImage} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500'/>
                {shopimage && (
                    <div className='mt-4'>
                      <img src={shopimage} alt="" className='w-full h-48 object-cover rounded-lg border'/>
                    </div>
                )}
                
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Price</label>
              <input type="number" placeholder='Enter Price ' onChange={(e)=>setPrice(e.target.value)}  value={price} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500'/>
            </div>
            
            <button type="submit" className='w-full cursor-pointer bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all'>Save</button>
        </form>
      </div>
      
    </div>
  )
}

export default AddItems
