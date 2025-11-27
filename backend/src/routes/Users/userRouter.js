import express from "express";
const userRouter=express.Router();
import {getCurrentUser, updateUserLocation} from "../../controllers/Users/userController.js"
import { isAuth } from "../../middleware/isAuth.js";
userRouter.get("/me",isAuth,getCurrentUser)
userRouter.post("/update-location",isAuth,updateUserLocation)
export default userRouter;