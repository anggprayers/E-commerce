import React from "react";

const Filters = ({ showFilter, setShowFilter, category, subCategory, toggleCategory, toggleSubCategory }) => {
    return (
        <div className="w-full sm:w-64 border-r border-gray-700 pr-4">
            {/* Toggle for mobile */}
            <button
                className="sm:hidden mb-4 bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => setShowFilter(!showFilter)}
            >
                {showFilter ? "Hide Filters" : "Show Filters"}
            </button>

            {/* Filters box */}
            {(showFilter || window.innerWidth >= 640) && (
                <div className="space-y-6">
                    {/* Category filter */}
                    <div>
                        <h3 className="text-white font-semibold mb-2">Category</h3>
                        <div className="flex flex-col space-y-1 text-sm text-gray-200">
                            {["Shoes", "Clothing", "Accessories"].map((cat) => (
                                <label key={cat} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        value={cat}
                                        checked={category.includes(cat)}
                                        onChange={toggleCategory}
                                    />
                                    <span>{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Subcategory filter */}
                    <div>
                        <h3 className="text-white font-semibold mb-2">Subcategory</h3>
                        <div className="flex flex-col space-y-1 text-sm text-gray-200">
                            {["Men", "Women", "Kids"].map((sub) => (
                                <label key={sub} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        value={sub}
                                        checked={subCategory.includes(sub)}
                                        onChange={toggleSubCategory}
                                    />
                                    <span>{sub}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Filters;
