import Shop from "../../models/shopModel.js";
import Order from "../../models/orderModel.js";
import { tryCatch } from "../../utils/tryCatch.js";
import User from "../../models/userModel.js";
import deliveryAssignment from "../../models/deliveryModel.js";
import { sentDeliveryEmail } from "../../utils/mailer.js";
import dotenv from "dotenv";
dotenv.config();
import RazorPay from "razorpay"
var instance = new RazorPay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});
export const placeOrder = tryCatch(async (req, res) => {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

    // Validate cart
    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
    }

    // Validate address
    if (
        !deliveryAddress?.text ||
        !deliveryAddress?.latitude ||
        !deliveryAddress?.longitude
    ) {
        return res.status(400).json({ message: "Send complete delivery address" });
    }

    // Group items by shop
    const groupItemsByShop = {};
    cartItems.forEach((item) => {
        const shopId = item.shop;
        if (!groupItemsByShop[shopId]) {
            groupItemsByShop[shopId] = [];
        }
        groupItemsByShop[shopId].push(item);
    });

    // Build shop orders
    const shopOrders = await Promise.all(
        Object.keys(groupItemsByShop).map(async (shopId) => {
            const shop = await Shop.findById(shopId).populate("owner");

            if (!shop) {
                throw new Error(`Shop not found: ${shopId}`);
            }

            const items = groupItemsByShop[shopId];
            const subtotal = items.reduce(
                (sum, i) => sum + Number(i.price) * Number(i.quantity),
                0
            );

            return {
                shop: shop._id,
                owner: shop.owner._id,
                subtotal,
                shopOrderItems: items.map((i) => ({
                    item: i.id || i._id,
                    name: i.name,
                    price: i.price,
                    quantity: i.quantity,
                })),
            };
        })
    );
    if(paymentMethod=="online"){
      const razorOrder=await instance.orders.create({
        amount:Math.round(totalAmount*100),
        currency:'INR',
        receipt:`receipt_${Date.now()}`
      })
       const newOrder = await Order.create({
        user: req.userId,
        paymentMethod,
        deliveryAddress,
        totalAmount,
        shopOrders,
        razorPayOrderId:razorOrder.id,
        payment:false
    });
    return res.status(200).json({
      razorOrder,
      orderId:newOrder._id,
      key_id: process.env.RAZORPAY_API_KEY
    })
    }
    // Create order
    const newOrder = await Order.create({
        user: req.userId,
        paymentMethod,
        deliveryAddress,
        totalAmount,
        shopOrders,
    });
    await newOrder.populate("shopOrders.shopOrderItems.item","name image price");
    await newOrder.populate("shopOrders.shop","name");
    return res.status(201).json(newOrder);
});
export const getUserOrders = tryCatch(async (req, res) => {
  const user = await User.findById(req.userId);

  // USER SIDE ORDERS
  if (user.roles === "user") {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .populate("shopOrders.shop", "name")
      .populate("shopOrders.owner", "name email mobile")
      .populate("shopOrders.shopOrderItems.item", "name image price");

    return res.status(200).json(orders);
  }

  // SHOP OWNER SIDE ORDERS
  if (user.roles === "owner") {
    const orders = await Order.find({ "shopOrders.owner": req.userId })
      .sort({ createdAt: -1 })
      .populate("shopOrders.shop", "name")
      .populate("user", "fullname email mobile")
      .populate("shopOrders.shopOrderItems.item", "name image price")
      .populate("shopOrders.assignedDeliveryBoy", "fullname mobile email")
    const filteredData = orders.map((order) => ({
      _id: order._id,
      paymentMethod: order.paymentMethod,
      deliveryAddress: order.deliveryAddress,
      user: order.user,
      createdAt: order.createdAt,
      payment:order.payment,
      // PICK ONLY THE SHOP ORDER OF THIS OWNER
      shopOrders: order.shopOrders.find(
        o => o.owner._id.toString() === req.userId
      ),
    }));

    return res.status(200).json(filteredData);
  }
});
export const updateOrderStatus = tryCatch(async (req, res) => {
  const { orderId, shopId } = req.params;
  const { status } = req.body;
  const order = await Order.findById(orderId)
  if (!order) return res.status(400).json({ message: "Order not found" });

  const shopOrder = order.shopOrders.find(
    o => o.shop.toString() === shopId
  );

  if (!shopOrder) {
    return res.status(400).json({ message: "Shop Order not found" });
  }

  // Update status
  shopOrder.status = status;

  let deliveryBoyPayload = [];
  console.log("shopOrderAssignment",shopOrder.assignment);
  if (status === "outfordelivery" && !shopOrder.assignment) {
    const { longitude, latitude } = order.deliveryAddress;
    console.log("Hi Buddy");
    // Step 1: find nearby delivery boys (5 km)
    const nearByDeliveryBoy = await User.find({
      roles: "delivery",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(latitude),Number(longitude)]
          },
          $maxDistance: 5000
        }
      }
    });
    console.log("nearbyRider",nearByDeliveryBoy);
    const nearbyIds = nearByDeliveryBoy.map(b => b._id);
    // Step 2: find busy delivery boys
    const busyDeliveryIds = await deliveryAssignment.find({
      assignedTo: {$in: nearbyIds },
      status: {$nin:["broadcasted", "expired"]}
    }).distinct("assignedTo");
    const busyIdSet=new Set(busyDeliveryIds.map(id=>String(id)))
    const availableDeliveryBoys = nearByDeliveryBoy.filter(
      b => !busyIdSet.has(String(b._id))
    );
    const deliveryCandidateIds = availableDeliveryBoys.map(b => b._id);
    if (deliveryCandidateIds.length === 0) {
      await order.save();
      return res.json({
        message: "Status updated, but no available delivery boys"
      });
    }

    // Step 3: create assignment
    const assignment = await deliveryAssignment.create({
      order: order._id,
      shop: shopOrder.shop,
      shopOrderId: shopOrder._id,
      broadcastedTo: deliveryCandidateIds,
      status: "broadcasted"
    });
    // assign delivery boy + assignment 
    shopOrder.assignment = assignment._id;
    shopOrder.assignedDeliveryBoy = assignment.assignedTo || null;
    

    deliveryBoyPayload = availableDeliveryBoys.map(b => ({
      id: b._id,
      fullname: b.fullname,
      longitude: b.location.coordinates?.[0],
      latitude: b.location.coordinates?.[1],
      mobile: b.mobile
    }));
  }

  // Save whole order once
  await order.save();
  const updatedShopOrder = order.shopOrders.find(
    o => o.shop.toString() === shopId
  );
  await order.populate("shopOrders.shop","name")
  await order.populate("shopOrders.assignedDeliveryBoy","fullname email mobile")

  

  return res.status(200).json({
    shopOrder: updatedShopOrder,
    assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
    availableBoys: deliveryBoyPayload,
    assignment: updatedShopOrder?.assignment._id
  });
});

export const getDeliveryBoyAssignment=tryCatch(async(req,res)=>{
  const deliveryBoysId=req.userId
  const assigments=await deliveryAssignment.find({
    broadcastedTo:deliveryBoysId,
    status:"broadcasted"
  })
  .populate("order")
  .populate("shop")
  const formatted=assigments.map(a=>({
    assignmentId:a._id,
    orderId:a.order._id,
    shopName:a.shop.name,
    deliveryAddress:a.order.deliveryAddress,
    items:a.order.shopOrders.find(so=>so._id.equals(a.shopOrderId)).shopOrderItems || [],
    subtotal:a.order.shopOrders.find(so=>so._id.equals(a.shopOrderId))?.subtotal
  }))
  return res.status(200).json(formatted);
})
export const acceptOrder = tryCatch(async (req, res) => {
  const { assignmentId  } = req.params;

  const assignment = await deliveryAssignment.findById(assignmentId);
  if (!assignment) {
    return res.status(400).json({ message: "Assignment not found" });
  }

  if (assignment.status !== "broadcasted") {
    return res.status(400).json({ message: "Assignment is expired" });
  }

  // Check if delivery boy already working on another active assignment
  const alreadyAssigned = await deliveryAssignment.findOne({
    assignedTo: req.userId,
    status: { $nin: ["broadcasted", "expired"] }
  });

  if (alreadyAssigned) {
    return res.status(400).json({ message: "You are already assigned to another order" });
  }

  // Assign the order to the user
  assignment.assignedTo = req.userId;
  assignment.status = "assigned";
  assignment.acceptedAt = new Date();
  await assignment.save();

  // Update Order
  const order = await Order.findById(assignment.order);
  if (!order) {
    return res.status(400).json({ message: "Order not found" });
  }

  const shopOrder = order.shopOrders.find(
    so => so._id.toString() === assignment.shopOrderId.toString()
  );

  if (!shopOrder) {
    return res.status(400).json({ message: "Shop order not found" });
  }

  shopOrder.assignedDeliveryBoy = req.userId;
  await order.save();

  await order.populate("shopOrders.assignedDeliveryBoy");

  return res.status(200).json({
    message: "Order Accepted"
  });
});


export const getAssignedOrder=tryCatch(async(req,res)=>{
  const assignment=await deliveryAssignment.findOne({
    assignedTo:req.userId,
    status:"assigned"
  })
  .populate("shop", "name")
  .populate("assignedTo","fullname email mobile location")
  .populate({
    path:"order",
    populate:[{path:"user",select: "fullname email location mobile"}]
  })
  if(!assignment){
    return res.status(400).json({message:"assignment not found"});
  }
  if(!assignment.order){
    return res.status(400).json({message:"Order not found"});
  }
  const shopOrder=assignment.order.shopOrders.find(so=>toString(so._id)===toString(assignment.shopOrderId))
  if(!shopOrder){
    return res.status(400).json({message:"Shop Order not found"});
  }

  let deliveryBoyLocation={lat:null,lon:null}
  if(assignment.assignedTo.location.coordinates.length===2){
    deliveryBoyLocation.lat=assignment.assignedTo.location.coordinates[0]
    deliveryBoyLocation.lon=assignment.assignedTo.location.coordinates[1]
  }
  let customerLocation={lat:null,lon:null}
  if(assignment.order.deliveryAddress){
    customerLocation.lat=assignment.order.deliveryAddress.latitude
    customerLocation.lon=assignment.order.deliveryAddress.longitude
  }
  return res.status(200).json({
    _id:assignment.order._id,
    user:assignment.order.user,
    shopOrder,
    deliveryAddress:assignment.order.deliveryAddress,
    deliveryBoyLocation,
    customerLocation
  })
})
export const getOrderById=tryCatch(async(req,res)=>{
  const {orderId}=req.params
  const order=await Order.findById(orderId)
  .populate("user")
  .populate({
    path:"shopOrders.shop",
    model:"Shop"
  })
  .populate({
    path:"shopOrders.assignedDeliveryBoy",
    model:"User"
  })
  .populate({
    path:"shopOrders.shopOrderItems.item",
    model:"Item"
  })
  .lean()
  if(!order){
    return res.status(400).json({message:"Order not found"})
  }
  return res.status(200).json(order)
})

export const sendDeliveryOTP=tryCatch(async(req,res)=>{
  const {orderId,shopOrderId}=req.body;
  const order=await Order.findById(orderId).populate("user")
  const shopOrder=order.shopOrders.id(shopOrderId)
  if(!order || !shopOrder){
    return res.status(400).json({message:"Enter valid Order Id"});
  }
  const otp=Math.floor(1000+Math.random()*9000).toString();
  shopOrder.deliveryOtp=otp
  shopOrder.otpExpires=Date.now() + 5*60*1000
  await order.save();
  await sentDeliveryEmail(order.user,otp)
  return res.status(200).json({message:`OTP Send Successfully to ${order?.user.fullname}`})
})

export const verifyDeliveryOTP=tryCatch(async(req,res)=>{
  const {orderId,shopOrderId,otp}=req.body;
  const order=await Order.findById(orderId).populate("user")
  const shopOrder=order.shopOrders.id(shopOrderId)
  if(!order || !shopOrder){
    return res.status(400).json({message:"Enter valid Order Id"});
  }
  if(shopOrder.deliveryOtp!==otp || !shopOrder.otpExpires || shopOrder.otpExpires<Date.now()){
    return res.status(400).json({message:"Expired OTP"});
  }
  shopOrder.status="delivered"
  shopOrder.deliveredAt=Date.now()
  await order.save();
  await deliveryAssignment.deleteOne({
    shopOrderId:shopOrder._id,
    order:order._id,
    assignedTo:shopOrder.assignedDeliveryBoy
  })
  return res.status(200).json({message:"Order Delivered Successfully"});
})

export const verifyPayment=tryCatch(async(req,res)=>{
  const {razorpay_payment_id,orderId}=req.body
  const payment=await instance.payments.fetch(razorpay_payment_id);
  if(!payment || payment.status!="captured"){
    return res.status(400).json({message:"Payment not captured"})
  }
  const order=await Order.findById(orderId);
  if(!order){
    return res.status(400).json({message:"Order not found"})
  }
  order.payment=true
  order.razorPayPayment=razorpay_payment_id;
  await order.save()
  await order.populate("shopOrders.shopOrderItems.item","name image price");
  await order.populate("shopOrders.shop","name");
  return res.status(200).json(order)
})