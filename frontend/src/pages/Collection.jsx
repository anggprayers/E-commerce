import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
    const { products, search, showSearch } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState("relevant");
    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory((prev) => prev.filter((item) => item !== e.target.value));
        } else {
            setCategory((prev) => [...prev, e.target.value]);
        }
    };
    const toggleSubCategory = (e) => {
        if (subCategory.includes(e.target.value)) {
            setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
        } else {
            setSubCategory((prev) => [...prev, e.target.value]);
        }
    };

    const handleFilterAndSort = () => {
        let productsCopy = products.slice();

        // 1. Apply search
        if (showSearch && search) {
            productsCopy = productsCopy.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
        }

        // 2. Apply category filter
        if (category.length > 0) {
            productsCopy = productsCopy.filter((item) => category.includes(item.category));
        }

        // 3. Apply subcategory filter
        if (subCategory.length > 0) {
            productsCopy = productsCopy.filter((item) => subCategory.includes(item.subCategory));
        }

        // 4. Apply sorting
        switch (sortType) {
            case "low-high":
                productsCopy.sort((a, b) => a.price - b.price);
                break;
            case "high-low":
                productsCopy.sort((a, b) => b.price - a.price);
                break;
            default:
                break; // relevant → no extra sorting
        }

        // 5. Set state
        setFilterProducts(productsCopy);
    };

    useEffect(() => {
        handleFilterAndSort();
    }, [products, category, subCategory, search, showSearch, sortType]);

    return (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t border-white">
            {/* Filter Options */}
            <div className="min-w-60 text-white">
                <p
                    onClick={() => setShowFilter(!showFilter)}
                    className="my-2 text-xl flex items-center cursor-pointer gap-2"
                >
                    FILTERS
                    <img
                        className={`h-3 sm:hidden transition-transform ${showFilter ? "rotate-[270deg]" : "rotate-0"}`}
                        src={assets.dropdown_icon}
                        alt=""
                    />
                </p>
                {/* Category Filter */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
                    <p className="mb-3 text-sm font-medium">CATEGORIES</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-white">
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3 accent-red-500"
                                value={"Men"}
                                onChange={toggleCategory}
                            />{" "}
                            Men
                        </p>
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3 accent-pink-500"
                                value={"Women"}
                                onChange={toggleCategory}
                            />{" "}
                            Women
                        </p>
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3 accent-blue-500"
                                value={"Kids"}
                                onChange={toggleCategory}
                            />{" "}
                            Kids
                        </p>
                    </div>
                </div>
                {/* SubCategory Filter */}
                <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? "" : "hidden"} sm:block`}>
                    <p className="mb-3 text-sm font-medium">TYPE</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-white">
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3 accent-gray-500"
                                value={"Topwear"}
                                onChange={toggleSubCategory}
                            />{" "}
                            Topwear
                        </p>
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3 accent-gray-500"
                                value={"Bottomwear"}
                                onChange={toggleSubCategory}
                            />{" "}
                            Bottomwear
                        </p>
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3 accent-gray-500"
                                value={"Winterwear"}
                                onChange={toggleSubCategory}
                            />
                            Winterwear
                        </p>
                    </div>
                </div>
            </div>
            {/* Right Side */}
            <div className="flex-1">
                <div className="flex justify-between text-base sm:text-2xl mb-4">
                    <Title text1={"ALL"} text2={"COLLECTIONS"} />
                    {/* Product Sorting */}
                    <select
                        onChange={(e) => setSortType(e.target.value)}
                        className="border-2 border-gray-300 text-sm px-2 bg-transparent text-white"
                    >
                        <option className="text-black" value="relevant">
                            Sort by: Relevant{" "}
                        </option>
                        <option className="text-black" value="low-high">
                            Sort by: Low to High
                        </option>
                        <option className="text-black" value="high-low">
                            Sort by: High to Low
                        </option>
                    </select>
                </div>
                {/* Products Mapping */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
                    {filterProducts.map((item, index) => (
                        <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Collection;
