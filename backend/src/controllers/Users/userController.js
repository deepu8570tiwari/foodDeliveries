import {tryCatch} from "../../utils/tryCatch.js";
import User from "../../models/userModel.js"
export const getCurrentUser=tryCatch(async(req,res)=>{
    const userId=req.userId;
    if(!userId){
        return res.status(400).json({message:"UserId is not found"});
    }
    const user =await User.findById(userId);
    if(!user){
        return res.status(400).json({message:"UserId is not found"});
    }
    return res.status(200).json({message:"User details", data:user});
})

export const updateUserLocation=tryCatch(async(req,res)=>{
    const {lat, lon}=req.body;
    const user=await User.findByIdAndUpdate(req.userId,{
        location:{
            type:'Point',
            coordinates:[lat,lon]
        }
    },{new:true});
    if(!user){
        return res.status(400).json({message:"User Not found"});
    }
    return res.status(200).json({message:"User Location updated"});
})