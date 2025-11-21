import User from "../../models/userModel.js";
import { tryCatch } from "../../utils/tryCatch.js";
import {sentOTPEmail} from "../../utils/mailer.js"
import bcryptjs from "bcryptjs";
export const sendOTP=tryCatch(async(req,res)=>{
    const {email}=req.body;
    const user= await User.findOne({email});
    if(!user){
        return res.status(400).json({
            status: false,
            message: "No account found with this email"
        });
    }
    const otp=Math.floor(1000+Math.random()*9000).toString();
    user.resetOtp=otp;
    user.otpExpires=Date.now()+5*60*1000;
    user.isOtpVerified=false;
    await user.save();
    await sentOTPEmail(email,otp);
    return res.status(200).json({
        status: true,
        message: "OTP send successfully"
    });
})
export const verifyOTP=tryCatch(async(req,res)=>{
    const {email,otp}=req.body;
    const user= await User.findOne({email});
    if(!user){
        return res.status(400).json({
            status: false,
            message: "No account found with this email"
        });
    }
    if(user.resetOtp!==otp){
        return res.status(400).json({
            status: false,
            message: "Try with different OTP its invalid"
        });
    }
    if(user.otpExpires<Date.now()){
        return res.status(400).json({
            status: false,
            message: "OTP has been expired"
        });
    }
    user.resetOtp=undefined;
    user.otpExpires=undefined;
    user.isOtpVerified=true;
    await user.save();
    return res.status(200).json({
        status: true,
        message: "OTP Verification successfully"
    });
})
export const resetPassword=tryCatch(async(req,res)=>{
    const {email, newpassword}=req.body;
    const user= await User.findOne({email});
    if(!user){
        return res.status(400).json({
            status: false,
            message: "No account found with this email"
        });
    }
    if(!user.isOtpVerified){
        return res.status(400).json({
            status: false,
            message: "OTP Verification is completed"
        });
    }
    const hasedNewpassword=await bcryptjs.hash(newpassword,10);
    user.password=hasedNewpassword;
    user.isOtpVerified=false;
    await user.save();
    return res.status(200).json({
        status: true,
        message: "Password reset successfully"
    });
})