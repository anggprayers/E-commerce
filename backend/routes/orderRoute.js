import express from 'express';
import {
    placeOrderGcash,
    allOrders,
    userOrders,
    updateStatus,
    placeOrder,
    verifyPayment,
} from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// Admin Features
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// COD Payment Feature
orderRouter.post('/place', authUser, placeOrder);

// Gcash Payment Feature
orderRouter.post('/gcash', authUser, placeOrderGcash);

// User Feature
orderRouter.post('/userorders', authUser, userOrders);

// Verify Payment Intent Status
orderRouter.post('/verify', verifyPayment);

export default orderRouter;
