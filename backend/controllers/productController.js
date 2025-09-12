import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, sportsCategory, category, subCategory, sizes, bestseller } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {
                    resource_type: "image",
                });
                return result.secure_url;
            })
        );

        const productData = {
            name,
            description,
            sportsCategory,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now(),
        };

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added!" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Function for list product
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Function for removing product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed!" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Function for single product details
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Function for updating product
const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, sportsCategory, category, subCategory, sizes, bestseller } = req.body;

        const product = await productModel.findById(id);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        // update fields
        product.name = name;
        product.description = description;
        product.price = Number(price);
        product.sportsCategory = sportsCategory;
        product.category = category;
        product.subCategory = subCategory;
        product.bestseller = bestseller === "true" || bestseller === true;
        product.sizes = JSON.parse(sizes);

        // handle new images if uploaded
        const images = [];
        for (let i = 1; i <= 4; i++) {
            if (req.files[`image${i}`]) {
                const result = await cloudinary.uploader.upload(req.files[`image${i}`][0].path, {
                    resource_type: "image",
                });
                images.push(result.secure_url);
            } else if (product.image[i - 1]) {
                // keep old image if no new one uploaded
                images.push(product.image[i - 1]);
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
