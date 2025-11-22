import axios from 'axios'
import React, { useEffect } from 'react'
import { userServiceUrl } from '../src/App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../src/redux/userSlice';

function useGetCity() {
  const dispatch=useDispatch();
  useEffect(()=>{
    const fetchUser=async()=>{
        try {
            const result=await axios.get(`${userServiceUrl}/api/v1/user/me`,
            {withCredentials:true}
        )
        dispatch(setUserData(result.data));
        console.log(result);
        } catch (error) {
            console.log(error);
        }
    }
    fetchUser();
  },[])
}

export default useGetCity
