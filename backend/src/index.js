import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import {connectDB} from "./configs/database.js";
import authRouter from "./routes/Auth/authRouter.js";
import resetRouter from "./routes/Auth/resetPassword.js";
import googleRouter from "./routes/Auth/googleRouter.js";
import userRouter from "./routes/Users/userRouter.js";
import shopRouter from "./routes/ShopOwner/shopOwner.js";
import itemsRouter from "./routes/ShopOwner/itemList.js";
dotenv.config();
const app=express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
const port=process.env.NODE_PORT;
app.use(express.json());
app.use(cookieParser())
app.use("/api/v1",authRouter);
app.use("/api/v1",resetRouter);
app.use("/api/v1/google-auth",googleRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/shop",shopRouter);
app.use("/api/v1/category",itemsRouter);
app.listen(port,async()=>{
    console.log(`Server is running on ${port}`);
    await connectDB();
})