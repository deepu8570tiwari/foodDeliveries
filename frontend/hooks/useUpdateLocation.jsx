import axios from 'axios'
import React, { useEffect } from 'react'
import { userServiceUrl } from '../src/App'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData,setItemInMyCity } from '../src/redux/userSlice';
function useUpdateLocation() {
  const dispatch=useDispatch();
  const {userData}=useSelector(state=>state.user);
  useEffect(()=>{
    const fetchUserLocation=async(lat,lon)=>{
        try {
            const result=await axios.post(`${userServiceUrl}/api/v1/user/update-location`,{lat,lon},
            {withCredentials:true}
        )
        console.log("userLocation",result.data);
        //dispatch(setItemInMyCity(result.data));
        } catch (error) {
            console.log(error);
        }
    }
   
    navigator.geolocation.watchPosition((pos)=>{
        fetchUserLocation(pos.coords.latitude,pos.coords.longitude);
    })
  },[userData])
}

export default useUpdateLocation
