import Shop from "../../models/shopModel.js";
import Order from "../../models/orderModel.js";
import { tryCatch } from "../../utils/tryCatch.js";
import User from "../../models/userModel.js";
import deliveryAssignment from "../../models/deliveryModel.js";
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
      .populate("shopOrders.shopOrderItems.item", "name image price");

    const filteredData = orders.map((order) => ({
      _id: order._id,
      paymentMethod: order.paymentMethod,
      deliveryAddress: order.deliveryAddress,
      user: order.user,
      createdAt: order.createdAt,

      // PICK ONLY THE SHOP ORDER OF THIS OWNER
      shopOrders: order.shopOrders.find(
        (o) => o.owner._id.toString() === req.userId
      ),
    }));

    return res.status(200).json(filteredData);
  }
});
export const updateOrderStatus = tryCatch(async (req, res) => {
  const { orderId, shopId } = req.params;
  const { status } = req.body;
  const order = await Order.findById(orderId)
  if (!order) return res.status(404).json({ message: "Order not found" });

  const shopOrder = order.shopOrders.find(
    o => o.shop.toString() === shopId
  );

  if (!shopOrder) {
    return res.status(400).json({ message: "Shop Order not found" });
  }

  // Update status
  shopOrder.status = status;

  let deliveryBoyPayload = [];

  if (status === "outfordelivery" || !shopOrder.assignment) {
    const { longitude, latitude } = order.deliveryAddress;

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