import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { tryCatch } from "../utils/tryCatch.js";
dotenv.config();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.NODE_EMAIL_ADDRESS,
    pass: process.env.NODE_EMAIL_PASSWORD,
  },
});
export const sentOTPEmail=tryCatch(async(to,otp)=>{
    await transporter.sendMail({
        from:process.env.NODE_EMAIL_ADDRESS,
        to:to,
        subject:"Reset Password",
        html:`<p>Your OTP for password reset is <b>${otp}</b>.It expire in 5 Minutes`
    })
})