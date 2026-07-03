import express from "express";
import * as orderController from "../controllers/order.controller.js";
import auth from "../middleware/auth.js";
import auth2Cust from "../middleware/auth2_cust.js";

const router = express.Router();

// Customer creates order
router.post("/", auth2Cust, orderController.createOrder);

// Owner routes
router.put("/:id/status", auth, orderController.completeOrder);
router.patch("/:orderId/items/:itemId/serve", auth, orderController.serveOrderItem);
router.get("/:id", auth, orderController.getOrder);

// Customer fetch orders
router.get("/customer/list", auth2Cust, orderController.getCustomerOrders);

export default router;
