import { tryCatch } from "../../utils/tryCatch.js";
import User from "../../models/userModel.js"
import { generateToken } from "../../middleware/generateToken.js";
export const googleAuthSignUp=tryCatch(async(req,res)=>{
    const {fullname,email, mobile, roles}=req.body;
    const user=await User.findOne({email});
    if(!user){
        user= await User.create({
            fullname,email,mobile, roles
        })
    }
    const token =generateToken(user._id);
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true
        });
    return res.status(201).json({
        status: true,
        message: "Your account was created successfully",
        token,
        data: user
    });
})