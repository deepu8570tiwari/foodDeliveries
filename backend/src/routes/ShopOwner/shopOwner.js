import express from "express";
const shopRouter=express.Router();
import {createShop,editShop,getOwnShop} from "../../controllers/ShopOwner/shopOwner.js"
import {upload} from "../../middleware/isUpload.js";
import {isAuth} from "../../middleware/isAuth.js";
shopRouter.post("/shop/create",isAuth, upload.single("image"),createShop);
shopRouter.put("/shop/update",isAuth, upload.single("image"),editShop);
shopRouter.get("/shop/list", isAuth, getOwnShop)
export default shopRouter;