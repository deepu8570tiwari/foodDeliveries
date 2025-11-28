import express from "express";
const orderRouter=express.Router();
import {acceptOrder, getAssignedOrder, getDeliveryBoyAssignment, getOrderById, getUserOrders, placeOrder, updateOrderStatus} from "../../controllers/Orders/orderController.js"
import {isAuth} from "../../middleware/isAuth.js";
orderRouter.post("/place-order",isAuth, placeOrder);
orderRouter.get("/my-orders",isAuth, getUserOrders);
orderRouter.post("/update-status/:orderId/:shopId",isAuth, updateOrderStatus);
orderRouter.get("/get-assignments",isAuth, getDeliveryBoyAssignment);
orderRouter.get("/accept-order/:assignmentId",isAuth, acceptOrder);
orderRouter.get("/current-assigned-order",isAuth, getAssignedOrder);
orderRouter.get("/get-order-by-id/:orderId",isAuth, getOrderById);
export default orderRouter;