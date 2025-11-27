import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { userServiceUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
function SignUp() {
    const primaryColor='#ff4d2d';
    const hoverColor='#e64323';
    const bgColor='#fff9f6';
    const borderColor='#ddd';
    const [showPassword, setShowPassword]=useState(false);
    const [role,setRole]=useState("user");
    const navigate= useNavigate();
    const [fullname, setFullname]=useState("");
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [mobile, setMobile]=useState("");
    const [error,setError]=useState("")
    const [loading, setLoading]=useState(false);
    const dispatch=useDispatch();
    const handleSignUp=async()=>{
        setLoading(true);
        try {
            const result= await axios.post(
                `${userServiceUrl}/api/v1/signup`,{
                fullname, email,password,mobile, roles:role},
                {withCredentials:true}
            )
            console.log("result",result);
            dispatch(setUserData(result.data));
            setError("");
            navigate('/');
            setLoading(false);
        } catch (error) {
            const msg = error?.response?.data?.message || "Something went wrong";
            setError(msg);
            setLoading(false);
        }
    }
    const handleGoogleSignUpAuth=async()=>{
        setError("");
        if(!mobile){
            setError("Mobile number is required");
            return;
        }
        const provider=new GoogleAuthProvider();
        const result=await signInWithPopup(auth,provider);
        try {
            const {data}= await axios.post(
                `${userServiceUrl}/api/v1/google-auth/signup`,{
                fullname:result.user.displayName, email:result.user.email,mobile, roles:role},
                {withCredentials:true}
            )
            dispatch(setUserData(data.data));
            setError("");
            navigate('/');
        } catch (error) {
            console.log("error",error);
        }
    }
  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4' style={{backgroundColor:bgColor}}>
      <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border`} style={{border:`1px solid ${borderColor}`}}>
        <h1 className={`text-3xl font-bold mb-2`} style={{color:primaryColor}}>Zigato</h1>
        <p className='text-gray-600 mb-8'> Create Your Account to get Started with delicious food deliveries</p>
        <button onClick={handleGoogleSignUpAuth} className="w-full mt-4 flex items-center cursor-pointer justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 
         border-gray-200 hover:bg-gray-100"><FcGoogle size={20}/><span>SignUp With Google</span></button>
        <div className='mb-4'>
            <label htmlFor='fullName' className='block text-gray-700 font-medium mb-1'>
                Full Name
            </label>
            <input type="text" onChange={(e)=>setFullname(e.target.value)} value={fullname} className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter your Full name' style={{border:`1px solid ${borderColor}`}} required/>
        </div>
         <div className='mb-4'>
            <label htmlFor='email' className='block text-gray-700 font-medium mb-1'>
                Email 
            </label>
            <input type="email" onChange={(e)=>setEmail(e.target.value)}  value={email} className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter Your Email Address' style={{border:`1px solid ${borderColor}`}} required/>
        </div>
        <div className='mb-4'>
            <label htmlFor='mobile' className='block text-gray-700 font-medium mb-1'>
                Mobile
            </label>
            <input type="tel" onChange={(e)=>setMobile(e.target.value)}  value={mobile} className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter Your Mobile Number' style={{border:`1px solid ${borderColor}`}} required/>
        </div>
        <div className='mb-4'>
            <label htmlFor='password' className='block text-gray-700 font-medium mb-1'>
                Password
            </label>
            <div className='relative'>
                <input type={`${showPassword?"text":"password"}`}  onChange={(e)=>setPassword(e.target.value)} value={password} className='w-full border cursor-pointer rounded-lg px-3 py-2 focus:outline-none' placeholder='Enter Your Password ' style={{border:`1px solid ${borderColor}`}} required/>
                <button className='absolute right-3 top-3.5 text-gray-500' onClick={()=>setShowPassword(prev=>!prev)}>{!showPassword ? <FaRegEye/> : <FaRegEyeSlash/>}</button>
            </div>
        </div>
        <div className='mb-4'>
            <label htmlFor='password' className='block text-gray-700 font-medium mb-1'>
                Choose Your Desire Roles
            </label>
            <div className='flex gap-2'>
            {["user", "owner", "delivery"].map((r)=>(
                <button key={r} className='flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer' 
                style={
                    role==r? {backgroundColor:primaryColor, color:"white"}:{border:`1px solid ${primaryColor}`, color:primaryColor}
                } onClick={()=>setRole(r)}>{r}</button>
            ))}
            </div>  
        </div>
         <button onClick={handleSignUp} className={`w-full mt-4 font-semibold rounded-lg py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`} disabled={loading}>{loading ? <ClipLoader size={20}/>:"Sign Up"}</button>
         {error && <p className="text-red-500 mt-2">{error}</p>}
         <p className='text-center mt-2 cursor-pointer' onClick={()=>navigate("/signin")}>Already have an account ? <span className='text-[#ff4d2d]'>Sign In</span></p>
      </div>
    </div>
  )
}

export default SignUp
