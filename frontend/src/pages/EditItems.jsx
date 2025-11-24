import React, { useState } from 'react'
import { FaUtensils } from 'react-icons/fa6';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { userServiceUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { ClipLoader } from 'react-spinners';

function EditItems() {
  const navigate=useNavigate();
  const {myShopData}=useSelector(state=>state.owner);
  const {itemId}=useParams();
  
  const categories=["Snacks","Main Course","Desserts","Pizza","Burgers","Sandwiches","South Indian","North Indian","Chinese","Fast Food","Others"];
  const [currentItem, setCurrentItem]=useState(null);
  const [name,setName]=useState("");
  const [price,setPrice]=useState(0);
  const [category,setCategory]=useState("");
  const [foodType,setFoodType]=useState("");
  const [itemimage,setItemImage]=useState("");
  const [sentimage,setSentImage]=useState(null);
  const [loading,setLoading]=useState(false);
  const dispatch = useDispatch();
  const handleImage=(e)=>{
    const file=e.target.files[0];
    setSentImage(file);
    setItemImage(URL.createObjectURL(file));
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    setLoading(true);
    try {
      const formData=new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("foodType", foodType);
      formData.append("price", price);
      if(sentimage){
        formData.append("image",sentimage)
      }
     const result = await axios.put(
        `${userServiceUrl}/api/v1/category/update/${itemId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        }
      );
      dispatch(setMyShopData(result.data));
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
       setLoading(false);
    }
  }
  useEffect(()=>{
    const handleGetItem=async()=>{
      try {
        const result=await axios.get(`${userServiceUrl}/api/v1/category/${itemId}`,{
          withCredentials:true
        })
        setCurrentItem(result.data);
        console.log("handleGet",result.data);
      } catch (error) {
        console.log(error);
      }
    }
    handleGetItem();
  },[itemId]);

  useEffect(()=>{
    setName(currentItem?.name ||"");
    setPrice(currentItem?.price ||0);
    setCategory(currentItem?.category ||"");
    setFoodType(currentItem?.foodType ||"");
    setItemImage(currentItem?.image ||"");
  },[currentItem])
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
            Edit Food Items
          </div>
        </div>
        <form className='space-y-5' onSubmit={handleSubmit} encType="multipart/form-data">
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
              <input type="text" placeholder='Enter Shop Name' onChange={(e)=>setName(e.target.value)}  value={name} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500'/>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Food Image</label>
              <input type="file" accept="image/*"  onChange={handleImage} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500'/>
                {itemimage && (
                    <div className='mt-4'>
                      <img src={itemimage} alt="" className='w-full h-48 object-cover rounded-lg border'/>
                    </div>
                )}
                
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Price</label>
              <input type="number" placeholder='Enter Price ' onChange={(e)=>setPrice(e.target.value)}  value={price} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500'/>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Select Category</label>
              <select onChange={(e)=>setCategory(e.target.value)}  value={foodType} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500'>
                <option value="veg">Veg</option>
                <option value="non veg">Non Veg</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Select Category</label>
              <select onChange={(e)=>setCategory(e.target.value)}  value={category} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500'>
                <option value="">Select Category</option>
                {categories.map((cate,index)=>(
                  <option value={cate} key={index}>{cate}</option>
                ))}
              </select>
            </div>
            <button type="submit" className='w-full cursor-pointer bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all' disabled={loading}>{loading ? <ClipLoader size={20} className='text-white'/>:"Save"}</button>
        </form>
      </div>
      
    </div>
  )
}

export default EditItems
