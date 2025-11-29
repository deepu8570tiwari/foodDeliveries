import express from "express";
const orderRouter=express.Router();
import {
    acceptOrder, 
    getAssignedOrder, 
    getDeliveryBoyAssignment, 
    getOrderById, 
    getUserOrders, 
    placeOrder, 
    sendDeliveryOTP, 
    updateOrderStatus, 
    verifyDeliveryOTP,
    verifyPayment
} from "../../controllers/Orders/orderController.js"
import {isAuth} from "../../middleware/isAuth.js";
orderRouter.post("/place-order",isAuth, placeOrder);
orderRouter.post("/verify-payment",isAuth, verifyPayment);
orderRouter.get("/my-orders",isAuth, getUserOrders);
orderRouter.get("/get-assignments",isAuth, getDeliveryBoyAssignment);
orderRouter.get("/accept-order/:assignmentId",isAuth, acceptOrder);
orderRouter.get("/current-assigned-order",isAuth, getAssignedOrder);
orderRouter.get("/get-order-by-id/:orderId",isAuth, getOrderById);
orderRouter.post("/update-status/:orderId/:shopId",isAuth, updateOrderStatus);
orderRouter.post("/send-delivery-otp",isAuth, sendDeliveryOTP);
orderRouter.post("/verify-delivery-otp",isAuth, verifyDeliveryOTP);
export default orderRouter;
