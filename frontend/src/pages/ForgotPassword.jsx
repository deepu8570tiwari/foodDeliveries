import React, { useState } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { userServiceUrl } from '../App';
import axios from 'axios';
import {ClipLoader} from "react-spinners";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [borderColor, setBorderColor] = useState("#e5e7eb"); // default gray border
  const [otp, setOtp]=useState("");
  const [newpassword, setNewpassword]=useState("");
  const [confirmpassword, setConfirmpassword]=useState("");
  const [error,setError]=useState("");
  const [loading, setLoading]=useState(false);
  const navigate=useNavigate();
  const handleSendOtp=async()=>{
    setLoading(true);
    try {
      const result=await axios.post(`${userServiceUrl}/api/v1/send-otp`,{email},
        {withCredentials:true}
    )
    setError("");
    setStep(2);
    setLoading(false);
    } catch (error) {
      const msg = error?.response?.data?.message || "Something went wrong";
      setError(msg);
      setLoading(false);
    }
  }
  const verifyOtp=async()=>{
    setLoading(true);
    try {
      const result=await axios.post(`${userServiceUrl}/api/v1/verify-otp`,{email,otp},
        {withCredentials:true}
    )
    console.log("is message send", result);
    setError("");
    setStep(3);
    setLoading(false);
    } catch (error) {
      const msg = error?.response?.data?.message || "Something went wrong";
      setError(msg);
      setLoading(false);
    }
  }
  const resetPassword=async()=>{
    setLoading(true);
    if(newpassword!==confirmpassword){
      return null;
    }
    try {
      const result=await axios.post(`${userServiceUrl}/api/v1/reset-password`,{email,newpassword},
        {withCredentials:true}
    )
    console.log("is message send", result);
    setError("");
    setLoading(false);
    navigate("/signin");
    } catch (error) {
      const msg = error?.response?.data?.message || "Something went wrong";
      setError(msg);
      setLoading(false);
    }
  }
  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        
        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowRoundBack size={30} className="text-[#ff4d2d] cursor-pointer" onClick={()=>navigate('/signin')}/>
          <h1 className="text-2xl font-bold text-[#ff4d2d]">Forgot Password</h1>
        </div>

        {
          step === 1 && (
            <div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                  Email
                </label>
                  <input
                    type="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setBorderColor("#ff4d2d"); // optional: highlight when typing
                    }}
                    value={email}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                    placeholder="Enter Your Email Address"
                    style={{ border: `1px solid ${borderColor}` }}
                    required
                  />
              
              </div>
                <button className="w-full mt-4 font-semibold rounded-lg py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer"
                  onClick={handleSendOtp} disabled={loading}>
                  {loading?<ClipLoader size={20}/>:"Send OTP"}
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
          )
        }
        {
          step === 2 && (
            <div>
              <div className="mb-6">
                <label htmlFor="otp" className="block text-gray-700 font-medium mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setBorderColor("#ff4d2d"); // optional: highlight when typing
                  }}
                  value={otp}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Enter Your OTP"
                  style={{ border: `1px solid ${borderColor}` }}
                  required
                />
              </div>
              <button 
                  className="w-full mt-4 font-semibold rounded-lg py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer"
                  onClick={verifyOtp} 
                disabled={loading}>
                   {loading?<ClipLoader size={20}/>:"Verify OTP"}
              </button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
          )
        }
        {
          step === 3 && (
            <div>
              <div className="mb-4">
                <label htmlFor="newPasword" className="block text-gray-700 font-medium mb-1">
                  New Password
                </label>
                <input
                  type="text"
                  onChange={(e) => {
                    setNewpassword(e.target.value);
                    setBorderColor("#ff4d2d"); // optional: highlight when typing
                  }}
                  value={newpassword}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Enter Your New Password"
                  style={{ border: `1px solid ${borderColor}` }}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
                  Confirm Password
                </label>
                <input
                  type="text"
                  onChange={(e) => {
                    setConfirmpassword(e.target.value);
                    setBorderColor("#ff4d2d"); // optional: highlight when typing
                  }}
                  value={confirmpassword}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Confirm Password"
                  style={{ border: `1px solid ${borderColor}` }}
                  required
                />
              </div>
            <button className="w-full mt-4 font-semibold rounded-lg py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer"
                  onClick={resetPassword} disabled={loading}>{loading?<ClipLoader size={20}/>:"Reset Your Password"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
          )
        }
      </div>
    </div>
  );
}

export default ForgotPassword;
