import React, { useEffect } from 'react'
import Nav from "../components/Nav"
import { useSelector } from 'react-redux'
import { userServiceUrl } from '../App';
import axios from 'axios';
function DeliveryDashboard() {
  const {userData}=useSelector(state=>state.user);
  const getAssignment=async()=>{
    try {
      const result = await axios.get(
        `${userServiceUrl}/api/v1/orders/get-assignments`,
        {
          withCredentials: true
        }
      );
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
  getAssignment()
  },[userData])
  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex flex-col items-center gap-5 overflow-y-auto'>
      <Nav/>
      <div className='w-full max-w-[800px] flex flex-col gap-5 items-center'>
        <div className='bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start text-center gap-2 items-center w-[90%] border border-orange-100'>
          <h1 className='text-xl font-bold text-[#ff4d2d] '>Welcome, {userData.data.fullname}</h1>
          <p className='text-[#ff4d2d]'><span className='font-semibold'>Latitude:</span> {userData.data.location.coordinates[0]},<span className='font-semibold'>Longitude:</span> {userData.data.location.coordinates[1]}</p>
        </div>
      </div>
    </div>
  )
}

export default DeliveryDashboard
