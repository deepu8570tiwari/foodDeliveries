import express from "express";
import { sendOTP, verifyOTP, resetPassword } from "../../controllers/Auth/resetPasswordController.js";
const resetRouter=express.Router();
resetRouter.post("/send-otp", sendOTP);
resetRouter.post("/verify-otp", verifyOTP);
resetRouter.post("/reset-password", resetPassword);
export default resetRouter;