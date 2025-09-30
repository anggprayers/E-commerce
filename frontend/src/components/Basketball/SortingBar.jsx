import React from "react";

const SortingBar = ({ filterProducts, indexOfFirst, indexOfLast, sortType, setSortType }) => (
    <div className="flex justify-between text-base sm:text-2xl mb-4">
        <p className="text-white text-sm sm:text-base mb-3">
            {filterProducts.length > 0 ? (
                <>
                    Showing <span className="font-bold">{indexOfFirst + 1}</span> -{" "}
                    <span className="font-bold">{Math.min(indexOfLast, filterProducts.length)}</span> of{" "}
                    <span className="font-bold">{filterProducts.length}</span> products
                </>
            ) : (
                "No products found"
            )}
        </p>
        <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2 bg-transparent text-white"
        >
            <option className="text-black" value="relevant">
                Sort by: Relevant
            </option>
            <option className="text-black" value="low-high">
                Sort by: Low to High
            </option>
            <option className="text-black" value="high-low">
                Sort by: High to Low
            </option>
            <option className="text-black" value="bestseller">
                Sort by: Best Sellers
            </option>
            <option className="text-black" value="latest-today">
                Sort by: Latest (Today)
            </option>
            <option className="text-black" value="latest-7days">
                Sort by: Latest (7 Days)
            </option>
        </select>
    </div>
);

export default SortingBar;
