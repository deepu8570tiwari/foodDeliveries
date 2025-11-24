import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { userServiceUrl } from '../src/App'
import { useDispatch, useSelector } from 'react-redux'
import { setCity, setState, setUserData,setAddress } from '../src/redux/userSlice';

function useGetCity() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const api_key = import.meta.env.VITE_GEO_API_KEY;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const result = await axios.get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${api_key}`
        );

        const city = result?.data?.results?.[0]?.city || "Unknown";
        const state = result?.data?.results?.[0]?.state || "Unknown";
        const address = result?.data?.results?.[0]?.address_line2 || result?.data?.results?.[0]?.address_line1 || "Unknown";
        dispatch(setCity(city));
        dispatch(setState(state));
        dispatch(setAddress(address));
      } catch (error) {
        console.error("City fetch error:", error);
      }
    });
  }, [userData]); // EFFECT DEPENDENCY GOES HERE
}

export default useGetCity
