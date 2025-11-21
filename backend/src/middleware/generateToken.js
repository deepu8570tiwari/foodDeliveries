import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { tryCatch } from "../utils/tryCatch.js";
dotenv.config();
export const generateToken=tryCatch(async(userId)=>{
    const token=await jwt.sign({userId},process.env.NODE_JWT_TOKEN, {expiresIn:"15d"});
    return token
})