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