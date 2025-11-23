import { uploadToCloudinary } from "../../middleware/isUpload.js";
import Shop from "../../models/shopModel.js";
import {tryCatch} from "../../utils/tryCatch.js"
export const createShop=tryCatch(async (req,res)=>{
    const { name, city, state, address } = req.body;
    let image = null;
    let publicId = null;
    if (req.file) {
        const uploaded = await uploadToCloudinary(req.file.buffer);
        image = uploaded.secure_url;
        publicId = uploaded.public_id; // store this in DB
    }
    const shop = await Shop.create({
        name,city,state,address,image,publicId,owner: req.userId
    });
  await shop.populate("owner");
  return res.status(201).json(shop);
})
export const editShop=tryCatch(async(req,res)=>{
    const { name, city, state, address } = req.body;
    let shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
        return res.status(400).json({ message: "Shop doesn't exist" });
    }
    let image = shop.image;
    let publicId = shop.publicId;

    if (req.file) {
        const uploaded = await uploadToCloudinary(req.file.path);
        image = uploaded.secure_url;
        publicId = uploaded.public_id;
    }
    const updatedResult = await Shop.findByIdAndUpdate(
        shop._id,
        {
        name,city,state,address,image,publicId},
        { new: true }
    );
  return res.status(200).json(updatedResult);
})
export const getOwnShop=tryCatch(async(req,res)=>{
    const shop=await Shop.findOne({owner:req.userId}).populate("owner items");
    if(!shop){
        return res.status(400).json({ message: "Shop doesn't exist" });
    }
    return res.status(200).json(shop);
})