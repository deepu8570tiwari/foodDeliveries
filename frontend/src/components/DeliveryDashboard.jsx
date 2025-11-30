import React, { useEffect, useState } from 'react';
import Nav from "../components/Nav";
import { useSelector } from 'react-redux';
import { userServiceUrl } from '../App';
import axios from 'axios';
import DeliveryTracking from './deliveryTracking';
import { useNavigate } from 'react-router-dom';

function DeliveryDashboard() {
  const { userData,socket } = useSelector(state => state.user);
  const [availableAssignments, setAvailableAssignment] = useState(null);
  const [showOtpBox, setShowOtpBox]=useState(false);
  const [currentOrder,setCurrentOrder]=useState()
  const [otp,setOTP]=useState("");
  const [deliveryBoyLocation,setDeliveryBoyLocation]=useState(null)
  const navigate=useNavigate();
  useEffect(()=>{
    
    if(!socket || userData?.data.roles!=="delivery") return 
    let watchId=null;
    console.log("UserLocationforDeliveryRidexxs",userData?.data.roles)
      if(navigator.geolocation){
        watchId= navigator.geolocation.watchPosition((position)=>{
          const latitude=position.coords.latitude
          const longitude=position.coords.longitude
          setDeliveryBoyLocation({lat:longitude,lon:latitude})
          socket.emit('updateLocation',{
            latitude,
            longitude,
            userId:userData?.data._id
          })
        }),
        (error)=>{
          console.log(error)
        },
        {
          enableHighAccuracy:true,
        }
      }
      return ()=>{
        if(watchId)
          navigator.geolocation.clearWatch(watchId)
      }
  },[socket,userData])
  const getAssignment = async () => {
    try {
      const result = await axios.get(
        `${userServiceUrl}/api/v1/orders/get-assignments`,
        { withCredentials: true }
      );
      setAvailableAssignment(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAssignedOrder=async(assignmentId)=>{
    try {
      const result = await axios.get(
        `${userServiceUrl}/api/v1/orders/current-assigned-order`,
        { withCredentials: true }
      );
      setCurrentOrder(result.data);
      console.log("Assigned Order to delivery boys", result.data);
    } catch (error) {
      console.log(error)
    }
  } 
  const acceptOrder=async(assignmentId)=>{
    try {
      const result = await axios.get(
        `${userServiceUrl}/api/v1/orders/accept-order/${assignmentId}`,
        { withCredentials: true }
      );
      console.log("Accept Order", result.data);
      await getAssignedOrder();
    } catch (error) {
      console.log(error)
    }
  }
  const sentOTP=async()=>{
    try {
      const result = await axios.post(
        `${userServiceUrl}/api/v1/orders/send-delivery-otp/`,{orderId:currentOrder._id, shopOrderId:currentOrder.shopOrder._id},
        { withCredentials: true }
      );
      setShowOtpBox(true);
    } catch (error) {
      console.log(error)
    }
  }
  const verifyOTP=async()=>{
    try {
      const result = await axios.post(
        `${userServiceUrl}/api/v1/orders/verify-delivery-otp/`,{orderId:currentOrder._id, shopOrderId:currentOrder.shopOrder._id, otp},
        { withCredentials: true }
      );
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }
 
  useEffect(() => {
    getAssignment();
    getAssignedOrder();
  }, [userData]);

  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col items-center gap-5 overflow-y-auto">
  <Nav />

  <div className="w-full max-w-[800px] flex flex-col gap-5 items-center">

    {/* USER INFO CARD */}
    <div className="bg-white rounded-2xl shadow-md p-5 text-center w-[90%] border border-orange-100">
      <h1 className="text-xl font-bold text-[#ff4d2d]">
        Welcome, {userData.data.fullname}
      </h1>

      <p className="text-[#ff4d2d] mt-1">
        <span className="font-semibold">Latitude: </span>
        {deliveryBoyLocation?.lat},
        <span className="font-semibold ml-1">Longitude:</span>{" "}
        {deliveryBoyLocation?.lon}
      </p>
    </div>

    {/* ========================== AVAILABLE ORDERS ========================== */}
    {!currentOrder && (
      <div className="bg-white rounded-2xl p-5 shadow w-[90%] border border-orange-100">
        <h1 className="text-lg font-bold mb-4">Available Orders</h1>

        <div className="space-y-4">
          {availableAssignments?.length > 0 ? (
            availableAssignments.map((a, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-semibold">{a?.shopName}</p>

                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Delivery Address:</span>{" "}
                    {a?.deliveryAddress?.text}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {a.item?.length} items • ₹{a.subtotal}
                  </p>
                </div>

                <button
                  className="cursor-pointer bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600"
                  onClick={() => acceptOrder(a.assignmentId)}
                >
                  Accept
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No Available Orders</p>
          )}
        </div>
      </div>
    )}

    {/* ========================== CURRENT ORDER SECTION ========================== */}
    {currentOrder && (
      <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
        <h2 className="text-lg font-bold mb-3">📦 Current Order</h2>

        {/* ORDER DETAIL BOX */}
        <div className="border rounded-lg p-4 mb-3">
          <p className="font-semibold text-sm">
            {currentOrder?.shopOrder?.shop?.name}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            {currentOrder?.deliveryAddress?.text}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {currentOrder?.shopOrder?.shopOrderItems?.length} items • ₹
            {currentOrder?.shopOrder?.subtotal}
          </p>
        </div>

        {/* LIVE TRACKING MAP */}
        <DeliveryTracking data={{
          deliveryBoyLocation: deliveryBoyLocation || {
                      lat: userData?.data.location?.coordinates?.[0],
                      lon: userData?.data.location?.coordinates?.[1],
                    },
                    customerLocation: {
                      lat: currentOrder.deliveryAddress?.latitude,
                      lon: currentOrder.deliveryAddress?.longitude,
                    },
        }} />

        {/* DELIVERY OTP BOX */}
        {!showOtpBox ? (
  <button
    className="mt-4 cursor-pointer w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200"
    onClick={sentOTP}
  >
    Mark As Delivered
  </button>
) : (
  <div className="mt-4 p-4 border rounded-xl bg-gray-50">
    <p className="text-sm font-semibold mb-2">
      Enter OTP sent to{" "}
      <span className="text-orange-500">
        {currentOrder?.user?.fullname}
      </span>
    </p>

    <input
      type="text"
      value={otp}
      onChange={(e) => setOTP(e.target.value)}   // FIXED
      className="w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
      placeholder="Enter OTP"
    />

    <button
      onClick={verifyOTP}
      className="w-full cursor-pointer bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all"
    >
      Submit OTP
    </button>
  </div>
)}

      </div>
    )}
  </div>
</div>

  );
}

export default DeliveryDashboard;
