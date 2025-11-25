import axios from 'axios'
import React, { useEffect } from 'react'
import { userServiceUrl } from '../src/App'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData,setItemInMyCity } from '../src/redux/userSlice';
function useGetItemsByCity() {
  const dispatch=useDispatch();
  const {city}=useSelector(state=>state.user);
  useEffect(()=>{
    if (!city) return;
    const fetchItemsByCity=async()=>{
        try {
            const result=await axios.get(`${userServiceUrl}/api/v1/category/get-items-by-city/${city}`,
            {withCredentials:true}
        )
        console.log("Items By Data",result.data);
        dispatch(setItemInMyCity(result.data));
        } catch (error) {
            console.log(error);
        }
    }
    fetchItemsByCity();
  },[city])
}

export default useGetItemsByCity
