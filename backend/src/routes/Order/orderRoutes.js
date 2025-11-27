import express from "express";
const orderRouter=express.Router();
import {getDeliveryBoyAssignment, getUserOrders, placeOrder, updateOrderStatus} from "../../controllers/Orders/orderController.js"
import {isAuth} from "../../middleware/isAuth.js";
orderRouter.post("/place-order",isAuth, placeOrder);
orderRouter.get("/my-orders",isAuth, getUserOrders);
orderRouter.post("/update-status/:orderId/:shopId",isAuth, updateOrderStatus);
orderRouter.get("/get-assignments",isAuth, getDeliveryBoyAssignment);

export default orderRouter;