import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { userServiceUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import {ClipLoader} from "react-spinners";
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
function SignIn() {
    const primaryColor='#ff4d2d';
    const hoverColor='#e64323';
    const bgColor='#fff9f6';
    const borderColor='#ddd';
    const [showPassword, setShowPassword]=useState(false);
    const navigate= useNavigate();
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [error,setError]=useState("")
    const [loading, setLoading]=useState(false);
    const dispatch=useDispatch();
    const handleSignIn=async()=>{
        setLoading(true);
        try {
            const result= await axios.post(
                `${userServiceUrl}/api/v1/signin`,{
                email,password},
                {withCredentials:true}
            )
            console.log(result);
            setError("");
            dispatch(setUserData(result.data));
            setLoading(false);
        } catch (error) {
            const msg = error?.response?.data?.message || "Something went wrong";
            setError(msg);
            setLoading(false);
        }
    }
    const handleGoogleSignInAuth=async()=>{
        const provider=new GoogleAuthProvider();
        const result=await signInWithPopup(auth,provider);
        try {
            const {data}= await axios.post(
                `${userServiceUrl}/api/v1/google-auth/signup`,{email:result.user.email},
                {withCredentials:true}
            )
            dispatch(setUserData(data));
        } catch (error) {
            const msg = error?.response?.data?.message || "Something went wrong";
            setError(msg);
        }
        console.log(result);
    }
  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4' style={{backgroundColor:bgColor}}>
      <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border`} style={{border:`1px solid ${borderColor}`}}>
        <h1 className={`text-3xl font-bold mb-2`} style={{color:primaryColor}}>Zigato</h1>
        <p className='text-gray-600 mb-8'> Sign In to your Account to get Started with delicious food deliveries</p>
        <button onClick={handleGoogleSignInAuth} className="w-full mt-4 flex items-center cursor-pointer justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 
         border-gray-200 hover:bg-gray-100"><FcGoogle size={20}/><span>Sign In With Google</span></button>
        
         <div className='mb-4'>
            <label htmlFor='email' className='block text-gray-700 font-medium mb-1'>
                Email 
            </label>
            <input type="email" onChange={(e)=>setEmail(e.target.value)} value={email} required className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter Your Email Address' style={{border:`1px solid ${borderColor}`}}/>
        </div>
        <div className='mb-4'>
            <label htmlFor='password' className='block text-gray-700 font-medium mb-1'>
                Password
            </label>
            <div className='relative'>
                <input type={`${showPassword?"text":"password"}`} onChange={(e)=>setPassword(e.target.value)} value={password} className='w-full border cursor-pointer rounded-lg px-3 py-2 focus:outline-none' placeholder='Enter Your Password ' style={{border:`1px solid ${borderColor}`}}/>
                <button className='absolute right-3 top-3.5 text-gray-500' required onClick={()=>setShowPassword(prev=>!prev)}>{!showPassword ? <FaRegEye/> : <FaRegEyeSlash/>}</button>
            </div>
        </div>
        <div className='text-right mb-4 text-[#ff4d2d] cursor-pointer' onClick={()=>navigate("/forgot-password")}>
            Forgot Password
        </div>
         <button onClick={handleSignIn} className={`w-full mt-4 font-semibold rounded-lg py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer ` } disabled={loading} >{loading ? <ClipLoader size={20}/>:"Sign In"}</button>
         {error && <p className="text-red-500 mt-2">{error}</p>}
         <p className='text-center mt-2 cursor-pointer' onClick={()=>navigate("/signup")}>Create new Account ? <span className='text-[#ff4d2d]'>Sign Up</span></p>
      </div>
    </div>
  )
}
export default SignIn
