import express from 'express';
import orderModel from '../models/orderModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        // req.body is already JSON
        const body = req.body;
        console.log('📩 Parsed webhook body:', body);

        const eventType = body.data?.attributes?.type;
        const paymentData = body.data?.attributes?.data;

        if (eventType === 'payment.paid') {
            const intentId = paymentData.attributes.payment_intent_id;

            const order = await orderModel.findOne({ intentId });
            if (order) {
                if (!order.payment) {
                    // update payment if false
                    // <-- prevent double update
                    order.payment = true;
                    await order.save();
                    console.log(`✅ Order ${order._id} marked as True via webhook.`);
                } else {
                    console.log(`⚠️ Order ${order._id} already marked as true, skipping.`);
                }
            } else {
                console.log(`⚠️ No order found for intentId ${intentId}`);
            }
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('❌ Webhook Error:', error);
        res.sendStatus(500);
    }
});

export default router;
