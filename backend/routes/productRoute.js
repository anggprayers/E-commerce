import express from "express";
import {
    addProduct,
    listProducts,
    singleProduct,
    removeProduct,
    updateProduct,
} from "../controllers/productController.js";
import { uploadMemoryFields } from "../middleware/multerMemory.js"; // updated import
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

// ================== Add Product ==================
productRouter.post("/add", adminAuth, uploadMemoryFields, addProduct);

// ================== Remove Product ==================
productRouter.post("/remove", adminAuth, removeProduct);

// ================== Get Single Product ==================
productRouter.post("/single", singleProduct);

// ================== List All Products ==================
productRouter.get("/list", listProducts);

// ================== Update Product ==================
productRouter.post("/update", adminAuth, uploadMemoryFields, updateProduct);

export default productRouter;
