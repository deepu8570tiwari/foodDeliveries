import express from "express";
const shopRouter=express.Router();
import {createShop,editShop,getOwnShop, getShopbyUserCity} from "../../controllers/ShopOwner/shopOwner.js"
import {upload} from "../../middleware/isUpload.js";
import {isAuth} from "../../middleware/isAuth.js";
shopRouter.get("/shop-by-city/:city", isAuth, getShopbyUserCity);
shopRouter.post("/create",isAuth, upload.single("image"),createShop);
shopRouter.put("/update",isAuth, upload.single("image"),editShop);
shopRouter.get("/list", isAuth, getOwnShop);
export default shopRouter;