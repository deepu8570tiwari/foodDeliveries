import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const isAuth=async(req,res,next)=>{
    try {
        const token=req.cookies?.token;
        if(!token){
            return res.status(401).json({message:"Token Not found"});
        }
        const decodeToken=jwt.verify(token,process.env.NODE_JWT_TOKEN);
        if(!decodeToken){
            return res.status(401).json({message:"Invalid token"})
        }
        req.userId=decodeToken.userId;
        next();
    } catch (error) {
        console.error("JWT Error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}