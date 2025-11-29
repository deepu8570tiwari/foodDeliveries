import express from "express";
const itemsRouter=express.Router();
import {createCategory,editItems, getItem, deleteItems, getItemByCity, getItemByShop, searchItems} from "../../controllers/ShopOwner/items.js"
import {upload} from "../../middleware/isUpload.js";
import {isAuth} from "../../middleware/isAuth.js";
itemsRouter.get("/search-items", isAuth,searchItems)
itemsRouter.post("/create",isAuth, upload.single("image"),createCategory);
itemsRouter.put("/update/:itemsId",isAuth, upload.single("image"),editItems);
itemsRouter.get("/:itemsId",isAuth,getItem);
itemsRouter.delete("/delete/:itemsId",isAuth,deleteItems);
itemsRouter.get("/get-items-by-city/:city",isAuth,getItemByCity);
itemsRouter.get("/get-item-by-shop/:shopId", isAuth,getItemByShop)

export default itemsRouter;