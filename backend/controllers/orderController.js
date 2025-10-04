import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

// PLACE ORDER (GCash, UnionBank, etc.)
export const placeOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const file = req.file;
        let { items, amount, address, paymentMethod } = req.body;

        // Parse JSON strings (multer sends text fields as strings)
        if (typeof items === "string") items = JSON.parse(items);
        if (typeof address === "string") address = JSON.parse(address);

        // Recalculate fallback total amount
        if (!amount && items?.length) {
            amount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        }

        if (!file) {
            return res.status(400).json({ success: false, message: "Receipt image is required." });
        }

        // Upload receipt to Cloudinary
        const uploadStream = cloudinary.uploader.upload_stream({ folder: "receipts" }, async (error, result) => {
            if (error) {
                console.error("Cloudinary upload error:", error);
                return res.status(500).json({ success: false, message: "Failed to upload receipt. Please try again." });
            }

            // ✅ Create new order document
            const newOrder = new orderModel({
                userId,
                items,
                address,
                amount,
                paymentMethod,
                receiptUrl: result.secure_url,
                payment: false, // default unverified
                status: "Pending Verification", // first stage
                date: Date.now(),
            });

            await newOrder.save();

            // ✅ Clear user’s cart after successful order
            await userModel.findByIdAndUpdate(userId, { cartData: {} });

            res.json({
                success: true,
                message: "Order placed successfully! Waiting for admin verification.",
            });
        });

        uploadStream.end(file.buffer);
    } catch (error) {
        console.error("Order placement error:", error);
        res.status(500).json({ success: false, message: "Failed to place order. Please try again." });
    }
};

// ADMIN: VIEW ALL ORDERS
export const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Fetch Orders Error:", error);
        res.status(500).json({ success: false, message: "Unable to fetch orders." });
    }
};

// USER: VIEW THEIR ORDERS
export const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId }).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error("User Orders Error:", error);
        res.status(500).json({ success: false, message: "Unable to load your orders." });
    }
};

// ADMIN: UPDATE ORDER STATUS (restricted if not verified)
export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const order = await orderModel.findById(orderId);

        if (!order) return res.status(404).json({ success: false, message: "Order not found." });
        if (!order.payment) {
            return res.status(403).json({ success: false, message: "Cannot update status until payment is verified." });
        }

        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Order status updated successfully." });
    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ success: false, message: "Failed to update status." });
    }
};

// ADMIN: VERIFY / UNVERIFY PAYMENT
export const verifyPayment = async (req, res) => {
    try {
        const { orderId, adminPass } = req.body;
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        // ✅ Hardcoded admin password check
        const ADMIN_PASSWORD = "kukz@sportswear";

        if (adminPass !== ADMIN_PASSWORD) {
            return res.status(403).json({ success: false, message: "Incorrect admin password." });
        }

        // ✅ Toggle payment verification
        order.payment = !order.payment;

        // ✅ Update order status accordingly
        if (order.payment) {
            order.status = "To Ship"; // automatically go to shipping queue
        } else {
            order.status = "Pending Verification"; // if unverified again
        }

        await order.save();

        return res.json({
            success: true,
            message: order.payment
                ? "Payment verified successfully. Order moved to 'To Ship'."
                : "Payment unverified. Order returned to 'Pending Verification'.",
        });
    } catch (error) {
        console.error("Verify Payment Error:", error);
        return res.status(500).json({ success: false, message: "Failed to verify payment. Please try again." });
    }
};

// ADMIN: REMOVE ORDER
export const removeOrder = async (req, res) => {
    try {
        const { id } = req.body;
        const order = await orderModel.findById(id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        await orderModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Order deleted successfully." });
    } catch (error) {
        console.error("Delete Order Error:", error);
        res.status(500).json({ success: false, message: "Failed to delete order." });
    }
};
