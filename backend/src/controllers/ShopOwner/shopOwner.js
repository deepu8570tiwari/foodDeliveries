import { uploadToCloudinary } from "../../middleware/isUpload.js";
import Shop from "../../models/shopModel.js";
import {tryCatch} from "../../utils/tryCatch.js"
export const createShop = tryCatch(async (req, res) => {
  const { name, city, state, address } = req.body;
  let image = null;
  let publicId = null;

  if (req.file) {
    const uploaded = await uploadToCloudinary(req.file.buffer);
    image = uploaded.secure_url;
    publicId = uploaded.public_id;
  }

  let shop = await Shop.create({
    name,
    city,
    state,
    address,
    image,
    publicId,
    owner: req.userId
  });

  // Correct populate
  shop = await shop.populate("owner").populate("items");

  return res.status(201).json(shop);
});

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
export const getOwnShop = tryCatch(async (req, res) => {
  const shop = await Shop.findOne({ owner: req.userId })
    .populate("owner")
    .populate({
      path: "items",
      options: { sort: { updatedAt: -1 } }   // ✅ Correct field name
    });

  if (!shop) {
    return res.status(400).json({ message: "Shop doesn't exist" });
  }

  return res.status(200).json(shop);
});
export const getShopbyUserCity = tryCatch(async (req, res) => {
  const { city } = req.params;

  const shops = await Shop.find({
    city: { $regex: new RegExp(`^${city.trim()}$`, "i") }
  }).populate({
    path: "items",
    options: { sort: { updatedAt: -1 } }
  });

  if (shops.length === 0) {
    return res.status(404).json({ message: "No shops found in this city" });
  }
  return res.status(200).json(shops);
});
