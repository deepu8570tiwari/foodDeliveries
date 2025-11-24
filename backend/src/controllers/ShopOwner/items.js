import { uploadToCloudinary, deleteFromCloudinary } from "../../middleware/isUpload.js";
import Item from "../../models/itemsModel.js";
import Shop from "../../models/shopModel.js";
import {tryCatch} from "../../utils/tryCatch.js"
export const createCategory = tryCatch(async (req, res) => {
  const { name, category, foodType, price } = req.body;

  let image = null;
  let publicId = null;

  if (req.file) {
    const uploaded = await uploadToCloudinary(req.file.buffer);
    image = uploaded.secure_url;
    publicId = uploaded.public_id;
  }

  const shop = await Shop.findOne({ owner: req.userId });
  if (!shop) {
    return res.status(400).json({ message: "Shop Not found" });
  }

  const item = await Item.create({
    name,
    category,
    foodType,
    price,
    image,
    publicId,
    shop: shop._id
  });

  shop.items.push(item._id);
  await shop.save();

  // ✅ Correct populate format
  await shop.populate([
    { path: "owner" },
    { path: "items", options: { sort: { updatedAt: -1 } } }
  ]);

  return res.status(201).json(shop);
});


export const editItems=tryCatch(async(req,res)=>{
    const itemId = req.params.itemsId;
    const {name,category,foodType,price}=req.body;
    let image;
    let publicId;
    if (req.file) {
        const uploaded = await uploadToCloudinary(req.file.buffer);
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
    const shop=await Shop.findOne({owner:req.userId}).populate({
        path:"items",
        options:{sort:{updatedAt:-1}}
    });
  return res.status(200).json(shop);
})
export const getItem=tryCatch(async(req,res)=>{
    const itemId=req.params.itemsId;
    const item=await Item.findById(itemId);
    if(!item){
        return res.status(400).json({message:"Items Not found"});
    }
    return res.status(200).json(item);
})
export const deleteItems = tryCatch(async (req, res) => {
  const itemsId = req.params.itemsId;

  // 1️⃣ Find item
  const item = await Item.findById(itemsId);
  if (!item) {
    return res.status(400).json({ message: "Item not found" });
  }

  // 2️⃣ Delete image from Cloudinary
  if (item.publicId) {
    await deleteFromCloudinary(item.publicId);
  }

  // 3️⃣ Delete the item document
  await Item.findByIdAndDelete(itemsId);

  // 4️⃣ Remove item from shop.items[]
  const shop = await Shop.findOne({ owner: req.userId });
  if (!shop) {
    return res.status(400).json({ message: "Shop not found" });
  }

  shop.items = shop.items.filter(
    (id) => id.toString() !== itemsId.toString()
  );

  await shop.save();

  // 5️⃣ Populate owner + sorted items
  await shop.populate([
    { path: "owner" },
    {
      path: "items",
      options: { sort: { updatedAt: -1 } }
    }
  ]);

  return res.status(200).json(shop);
});
