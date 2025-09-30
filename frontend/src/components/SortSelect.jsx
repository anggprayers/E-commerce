import React from "react";

const SortSelect = ({ sortType, setSortType }) => {
    return (
        <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded bg-white text-sm sm:text-base"
        >
            <option value="relevant">Relevant</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="bestseller">Bestseller</option>
            <option value="latest-today">Latest: Today</option>
            <option value="latest-7days">Latest: Last 7 Days</option>
        </select>
    );
};

export default SortSelect;
