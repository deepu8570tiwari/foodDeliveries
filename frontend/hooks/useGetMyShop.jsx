import axios from 'axios'
import React, { useEffect } from 'react'
import { userServiceUrl } from '../src/App'
import { useDispatch, useSelector } from 'react-redux'
import { setMyShopData } from '../src/redux/ownerSlice';

function useGetMyShop() {
  const {userData}=useSelector(state=>state.user);
  const dispatch=useDispatch();
  useEffect(()=>{
    const fetchShop=async()=>{
        try {
            const result=await axios.get(`${userServiceUrl}/api/v1/shop/list`,
            {withCredentials:true}
        )
        dispatch(setMyShopData(result.data));
        } catch (error) {
            console.log(error);
        }
    }
    fetchShop();
  },[userData])
}

export default useGetMyShop
