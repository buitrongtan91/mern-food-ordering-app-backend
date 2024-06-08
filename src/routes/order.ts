import express from "express";
import OrderController from "../controllers/OrderController";
import { jwtCheck, jwtParse } from "../middlewares/auth";

const router = express.Router();

router.post("/checkout/create-checkout-session", jwtCheck, jwtParse, OrderController.createCheckoutSession);
router.post("/checkout/webhook", OrderController.stripeWebhookHandler);
router.get("/my-orders", jwtCheck, jwtParse, OrderController.getOrders);

export default router;
