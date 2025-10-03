import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import streamifier from "streamifier";

// helper to upload from buffer
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
            if (result) resolve(result.secure_url);
            else reject(error);
        });
        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};

// ================== Add Product ==================
const addProduct = async (req, res) => {
    try {
        const { name, description, price, sportsCategory, category, subCategory, sizes, bestseller } = req.body;

        // grab uploaded images
        const images = [];
        for (let i = 1; i <= 4; i++) {
            if (req.files[`image${i}`]) {
                const file = req.files[`image${i}`][0];
                const url = await uploadToCloudinary(file.buffer);
                images.push(url);
            }
        }

        const productData = {
            name,
            description,
            sportsCategory,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" || bestseller === true,
            sizes: JSON.parse(sizes),
            image: images,
            date: Date.now(),
        };

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added!" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ================== List Products ==================
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ================== Remove Product ==================
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed!" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ================== Single Product ==================
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ================== Update Product ==================
const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, sportsCategory, category, subCategory, sizes, bestseller } = req.body;

        const product = await productModel.findById(id);
        if (!product) return res.json({ success: false, message: "Product not found" });

        product.name = name;
        product.description = description;
        product.price = Number(price);
        product.sportsCategory = sportsCategory;
        product.category = category;
        product.subCategory = subCategory;
        product.bestseller = bestseller === "true" || bestseller === true;
        product.sizes = JSON.parse(sizes);

        // handle new uploads
        const images = [];
        for (let i = 1; i <= 4; i++) {
            if (req.files[`image${i}`]) {
                const file = req.files[`image${i}`][0];
                const url = await uploadToCloudinary(file.buffer);
                images.push(url);
            } else if (product.image[i - 1]) {
                images.push(product.image[i - 1]); // keep old
            }
        }
        product.image = images;

        await product.save();
        res.json({ success: true, message: "Product Updated!" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { listProducts, addProduct, singleProduct, removeProduct, updateProduct };
