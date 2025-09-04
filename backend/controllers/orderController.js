import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import axios from 'axios';

const origin = process.env.FRONTEND_URL || 'http://localhost:5173';

// Paymongo request with auth header
const paymongo = axios.create({
    baseURL: 'https://api.paymongo.com/v1',
    headers: {
        Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY).toString('base64')}`,
        'Content-Type': 'application/json',
    },
});

// Placing order using COD Payment
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: 'Order Placed Successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Placing order using Gcash Payment
const placeOrderGcash = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        let formattedPhone = address.phone;
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '+63' + formattedPhone.substring(1);
        }

        // 1. Create Payment Intent
        const intentRes = await paymongo.post('/payment_intents', {
            data: {
                attributes: {
                    amount: amount * 100, // centavos
                    payment_method_allowed: ['gcash'],
                    currency: 'PHP',
                },
            },
        });

        const intent = intentRes.data.data;
        const clientKey = intent.attributes.client_key;
        const intentId = intent.id;

        // 2. Create Payment Method (GCash)
        const pmRes = await paymongo.post('/payment_methods', {
            data: {
                attributes: {
                    type: 'gcash',
                    billing: {
                        name: `${address.firstName} ${address.lastName}`,
                        email: address.email,
                        phone: formattedPhone,
                    },
                    redirect: {
                        return_url: `${origin}/verify`,
                    },
                },
            },
        });

        const paymentMethodId = pmRes.data.data.id;

        // 3. Attach Payment Method to Intent
        const attachRes = await paymongo.post(`/payment_intents/${intentId}/attach`, {
            data: {
                attributes: {
                    payment_method: paymentMethodId,
                    client_key: clientKey,
                    return_url: `${origin}/verify`,
                },
            },
        });

        const checkoutUrl = attachRes.data.data.attributes.next_action.redirect.url;

        // Save order with intentId
        const newOrder = new orderModel({
            userId,
            items,
            address,
            amount,
            paymentMethod: 'Gcash',
            payment: false,
            date: Date.now(),
            intentId,
        });
        await newOrder.save();

        res.json({ success: true, checkoutUrl });
    } catch (error) {
        console.log('GCash Payment Error', error.response?.data || error.message);
        res.json({
            success: false,
            message: error.response?.data?.errors?.[0]?.detail || error.message,
        });
    }
};

// Verify payment intent status (secure POST)
const verifyPayment = async (req, res) => {
    try {
        const { payment_intent_id: intentId } = req.body;

        if (!intentId) {
            return res.json({ success: false, paid: false, message: 'Missing payment_intent_id' });
        }

        // ✅ Call PayMongo to check latest intent status
        const intentRes = await paymongo.get(`/payment_intents/${intentId}`);
        const intent = intentRes.data.data;
        const status = intent.attributes.status;

        if (status === 'succeeded') {
            // update only payment = true
            await orderModel.findOneAndUpdate(
                { intentId },
                { $set: { payment: true } },
                { new: true }
            );

            return res.json({ success: true, paid: true, status });
        } else {
            return res.json({ success: true, paid: false, status });
        }
    } catch (error) {
        console.error('Verify Error:', error.response?.data || error.message);
        res.json({
            success: false,
            paid: false,
            message: error.response?.data?.errors?.[0]?.detail || error.message,
        });
    }
};

// All Orders Data for Admin Panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// User Order Data for Frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;

        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update Order Status from Admin Panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: 'Order Status Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { placeOrder, placeOrderGcash, allOrders, userOrders, updateStatus, verifyPayment };
