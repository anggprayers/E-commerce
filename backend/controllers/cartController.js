import userModel from "../models/userModel.js";

// Add products to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size, frontName = "", backName = "", jerseyNumber = "" } = req.body;

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res
                .status(404)
                .json({ success: false, message: "We couldn’t find your account. Please login again." });
        }

        let cartData = userData.cartData || {};

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        if (!cartData[itemId][size]) {
            cartData[itemId][size] = {
                quantity: 0,
                frontName,
                backName,
                jerseyNumber,
            };
        }

        // increase quantity
        cartData[itemId][size].quantity += 1;

        // overwrite names if provided
        if (frontName) cartData[itemId][size].frontName = frontName;
        if (backName) cartData[itemId][size].backName = backName;
        if (jerseyNumber) cartData[itemId][size].jerseyNumber = jerseyNumber;

        await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update user cart
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity, frontName = "", backName = "", jerseyNumber = "" } = req.body;

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "Your session expired. Please login again." });
        }

        let cartData = userData.cartData || {};

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        if (quantity > 0) {
            // if item exists, update quantity and optional fields
            cartData[itemId][size] = {
                quantity,
                frontName: frontName || cartData[itemId][size]?.frontName || "",
                backName: backName || cartData[itemId][size]?.backName || "",
                jerseyNumber: jerseyNumber || cartData[itemId][size]?.jerseyNumber || "",
            };
        } else {
            // remove size if quantity is 0
            delete cartData[itemId][size];

            // if no sizes left for this product, remove the product entry
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        }

        await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
    }
};

// Get user cart data
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};
        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Clear cart
const clearCart = async (req, res) => {
    try {
        const { userId } = req.body;

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await userModel.findByIdAndUpdate(userId, { cartData: {} }, { new: true });
        res.json({ success: true, message: "Cart Cleared" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart, clearCart };
