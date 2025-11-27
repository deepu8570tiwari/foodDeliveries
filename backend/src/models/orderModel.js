import mongoose from "mongoose";
const shopOrderItemsSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true
  },
  name:{
    type:String,
    required:true,
  },
  price: { 
    type: Number, 
    required: true 
  },
  quantity: {
    type: Number, 
    required: true, 
    min: 1
  }
}, { timestamps: true });

const shopOrderSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  subtotal: { type: Number, required: true },
  shopOrderItems: [shopOrderItemsSchema],
  status: {
    type: String,
    enum: ["pending", "preparing", "outfordelivery", "delivered","cancelled"],
    default: "pending"
  },
  assignment:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"deliveryAssignment",
    default:null
  },
  assignedDeliveryBoy:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
  }
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ["cod", "online"],
    required: true
  },
  deliveryAddress: {
    text: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  totalAmount: { type: Number, required: true },
  shopOrders: [shopOrderSchema]
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
