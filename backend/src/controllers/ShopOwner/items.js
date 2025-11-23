import { uploadToCloudinary } from "../../middleware/isUpload.js";
import Item from "../../models/itemsModel.js";
import Shop from "../../models/shopModel.js";
import {tryCatch} from "../../utils/tryCatch.js"
export const createCategory=tryCatch(async (req,res)=>{
    const { name, category, foodType, price } = req.body;
    let image = null;
    let publicId = null;
    if (req.file) {
        const uploaded = await uploadToCloudinary(req.file.path);
        image = uploaded.secure_url;
        publicId = uploaded.public_id; // store this in DB
    }
    const shop=await Shop.findOne({owner:req.userId});
    if(!shop){
        return res.status(400).json({message:"Shop Not found"});
    }
    const items=await Item.create({
        name,category,foodType,price,image,shop:shop._id
    })
  return res.status(201).json(items);
})
export const editItems=tryCatch(async(req,res)=>{
    const itemId = req.params.itemsId;
    const {name,category,foodType,price}=req.body;

    if (req.file) {
        const uploaded = await uploadToCloudinary(req.file.path);
        image = uploaded.secure_url;
        publicId = uploaded.public_id;
    }
    const updatedResult = await Item.findByIdAndUpdate(
        itemId,
        {
        name,category,foodType,price,image,publicId},
        { new: true }
    );
    if(!updatedResult){
          return res.status(400).json({message:"Items Not found"});
    }

  return res.status(200).json(updatedResult);

})