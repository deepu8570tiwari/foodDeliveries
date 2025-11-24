import axios from 'axios'
import React, { useEffect } from 'react'
import { userServiceUrl } from '../src/App'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData,setShopInMyCity } from '../src/redux/userSlice';
function useGetShopByCity() {
  const dispatch=useDispatch();
  const {city}=useSelector(state=>state.user);
  useEffect(()=>{
    if (!city) return;
    const fetchShop=async()=>{
        try {
            const result=await axios.get(`${userServiceUrl}/api/v1/shop/shop-by-city/${city}`,
            {withCredentials:true}
        )
        dispatch(setShopInMyCity(result.data));
        } catch (error) {
            console.log(error);
        }
    }
    fetchShop();
  },[city])
}

export default useGetShopByCity
