import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/UserDashboard';
import DeliveryDashboard from '../components/DeliveryDashboard';
import OwnerDashboard from '../components/OwnerDashboard';
function Home() {
    const {userData}=useSelector(state=>state.user);
    console.log("HomePage",userData);
  return (
    <div className='w[100vw] min-h[100vh] pt-[60px] flex flex-col items-center bg-[#ff9f6]'>
      {userData.data.roles=="user" && <UserDashboard/>}
      {userData.data.roles=="owner" && <OwnerDashboard/>}
      {userData.data.roles=="delivery" && <DeliveryDashboard/>}
    </div>
  )
}

export default Home
