import React from "react";
import ProductItem from "./ProductItem"; // keep direct import (not lazy)

const ProductList = ({ currentItems, currentPage }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentItems.length > 0 ? (
                currentItems.map((item, idx) => (
                    <ProductItem
                        key={`${item._id}-${currentPage}-${idx}`}
                        id={item._id}
                        image={item.image}
                        name={item.name}
                        price={item.price}
                    />
                ))
            ) : (
                <p className="col-span-full text-center text-gray-400">No products found</p>
            )}
        </div>
    );
};

export default ProductList;
