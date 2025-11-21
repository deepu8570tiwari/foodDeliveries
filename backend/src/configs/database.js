import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { tryCatch } from "../utils/tryCatch.js";
export const connectDB=tryCatch(async(req, res)=>{
    await mongoose.connect(process.env.NODE_MONGOOSE_URI);
    console.log("Database is connected successfully");
})