import express from "express";
const userRouter=express.Router();
import {getCurrentUser} from "../../controllers/Users/userController.js"
import { isAuth } from "../../middleware/isAuth.js";
userRouter.get("/user/me",isAuth,getCurrentUser)
export default userRouter;