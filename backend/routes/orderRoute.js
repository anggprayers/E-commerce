import express from "express";
import {
    placeOrder,
    allOrders,
    userOrders,
    updateStatus,
    verifyPayment,
    removeOrder,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";
import authUserForm from "../middleware/authForm.js"; // new middleware
import uploadReceipt from "../middleware/multerReceipt.js";

const orderRouter = express.Router();

// Admin routes
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// Place order
orderRouter.post("/place", authUserForm, uploadReceipt, placeOrder);

// Verify payment
orderRouter.post("/payment", authUser, verifyPayment);

// User orders
orderRouter.post("/userorders", authUser, userOrders);

// Remove/Delete orders
orderRouter.post("/remove", adminAuth, removeOrder);

export default orderRouter;
