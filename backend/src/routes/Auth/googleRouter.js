import express from "express";
import { googleAuthSignUp } from "../../controllers/Auth/googeAuthController.js";
const googleRouter=express.Router();
googleRouter.post("/signup", googleAuthSignUp);
export default googleRouter;