import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { CashOnDeliveryOrderController, getOrderController, OnlinePaymentController } from "../controllers/order.controller.js";
const orderRouter=Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post('/checkout',auth,OnlinePaymentController)
orderRouter.get("/get-order",auth,getOrderController)

export default orderRouter;