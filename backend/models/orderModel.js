import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [
        {
            _id: { type: String, required: true },
            name: String,
            size: String,
            quantity: Number,
            price: Number,
            image: Array,

            frontName: { type: String, default: "" },
            backName: { type: String, default: "" },
            jerseyNumber: { type: String, default: "" },
        },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    receiptUrl: { type: String, required: true },
    status: { type: String, default: "Pending Verification" },
    paymentMethod: { type: String, required: true }, // GCash / UnionBank
    payment: { type: Boolean, default: false }, // Will only be true after admin verifies
    date: { type: Number, required: true },
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
