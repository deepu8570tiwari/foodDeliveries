import express from "express";
const itemsRouter=express.Router();
import {createCategory,editItems, getItem, deleteItems} from "../../controllers/ShopOwner/items.js"
import {upload} from "../../middleware/isUpload.js";
import {isAuth} from "../../middleware/isAuth.js";
itemsRouter.post("/create",isAuth, upload.single("image"),createCategory);
itemsRouter.put("/update/:itemsId",isAuth, upload.single("image"),editItems);
itemsRouter.get("/:itemsId",isAuth,getItem);
itemsRouter.delete("/delete/:itemsId",isAuth,deleteItems);
export default itemsRouter;