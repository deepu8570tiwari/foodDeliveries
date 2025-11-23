import express from "express";
const itemsRouter=express.Router();
import {createCategory,editItems} from "../../controllers/ShopOwner/items.js"
import {upload} from "../../middleware/isUpload.js";
import {isAuth} from "../../middleware/isAuth.js";
itemsRouter.post("/category/create",isAuth, upload.single("image"),createCategory);
itemsRouter.put("/category/update/:itemsId",isAuth, upload.single("image"),editItems);
export default itemsRouter;