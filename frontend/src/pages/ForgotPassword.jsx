import React, { useState } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [borderColor, setBorderColor] = useState("#e5e7eb"); // default gray border
  const navigate=useNavigate();
  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        
        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowRoundBack size={30} className="text-[#ff4d2d] cursor-pointer" onClick={()=>navigate('/signin')}/>
          <h1 className="text-2xl font-bold text-[#ff4d2d]">Forgot Password</h1>
        </div>

        {step === 1 && (
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
            />
              <button 
      className="w-full mt-4 font-semibold rounded-lg py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer"
      onClick={() => setStep(2)} // go to OTP page or next step
    >
      Send OTP
    </button>
          </div>
          
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;
