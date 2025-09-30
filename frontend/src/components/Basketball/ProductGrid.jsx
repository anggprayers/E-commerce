import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProductGrid = ({ items, ProductItem, currentPage }) => (
    <AnimatePresence mode="wait">
        <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6"
        >
            {items.map((item, index) => (
                <ProductItem
                    key={item._id || index}
                    id={item._id}
                    name={item.name}
                    price={item.price}
                    image={item.image}
                />
            ))}
        </motion.div>
    </AnimatePresence>
);

export default ProductGrid;
