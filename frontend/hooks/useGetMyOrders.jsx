import axios from 'axios'
import React, { useEffect } from 'react'
import { userServiceUrl } from '../src/App'
import { useDispatch, useSelector } from 'react-redux'
import { setMyShopData } from '../src/redux/ownerSlice';
import { setMyOrders } from '../src/redux/userSlice';

function useGetMyOrder() {
  const {userData}=useSelector(state=>state.user);
  const dispatch=useDispatch();
  useEffect(()=>{
    if (!userData) return;
    const fetchOrders=async()=>{
        try {
            const result=await axios.get(`${userServiceUrl}/api/v1/orders/my-orders`,
            {withCredentials:true}
        )
        dispatch(setMyOrders(result.data));
        console.log("useMyOrder",result.data);
        } catch (error) {
            console.log(error);
        }
    }
    fetchOrders();
  },[userData])
}

export default useGetMyOrder
