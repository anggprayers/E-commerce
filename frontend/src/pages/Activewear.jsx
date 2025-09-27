import React, { useContext, useEffect, useState, lazy, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Pagination from "../components/Pagination";
import { motion, AnimatePresence } from "framer-motion";

const ProductItem = lazy(() => import("../components/ProductItem"));

const Activewear = () => {
    const { products, search, showSearch } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);

    // --- Persisted States ---
    const [sortType, setSortType] = useState(() => {
        const saved = sessionStorage.getItem("activewearSortType");
        return saved || "relevant";
    });

    const [currentPage, setCurrentPage] = useState(() => {
        const saved = sessionStorage.getItem("activewearCurrentPage");
        return saved ? parseInt(saved, 10) : 1;
    });

    const [category, setCategory] = useState(() => {
        const saved = sessionStorage.getItem("activewearCategory");
        return saved ? JSON.parse(saved) : [];
    });

    const [subCategory, setSubCategory] = useState(() => {
        const saved = sessionStorage.getItem("activewearSubCategory");
        return saved ? JSON.parse(saved) : [];
    });

    // --- Handlers ---
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

    // --- Persist to sessionStorage ---
    useEffect(() => {
        sessionStorage.setItem("activewearCategory", JSON.stringify(category));
    }, [category]);

    useEffect(() => {
        sessionStorage.setItem("activewearSubCategory", JSON.stringify(subCategory));
    }, [subCategory]);

    useEffect(() => {
        sessionStorage.setItem("activewearCurrentPage", currentPage);
    }, [currentPage]);

    useEffect(() => {
        sessionStorage.setItem("activewearSortType", sortType);
    }, [sortType]);

    // --- Clear sessionStorage on unmount ---
    useEffect(() => {
        return () => {
            sessionStorage.removeItem("activewearCategory");
            sessionStorage.removeItem("activewearSubCategory");
            sessionStorage.removeItem("activewearCurrentPage");
            sessionStorage.removeItem("activewearSortType");
        };
    }, []);

    // Ref for products section
    const productsRef = useRef(null);

    // --- Update filtered products ---
    useEffect(() => {
        let productsCopy = products.slice();

        productsCopy = productsCopy.filter((item) => item.sportsCategory?.toLowerCase().trim() === "activewear");

        if (showSearch && search) {
            productsCopy = productsCopy.filter((item) =>
                item.name?.toLowerCase().includes(search.toLowerCase().trim())
            );
        }

        if (category.length > 0) {
            productsCopy = productsCopy.filter((item) =>
                category.some((cat) => item.category?.toLowerCase().trim() === cat.toLowerCase().trim())
            );
        }

        if (subCategory.length > 0) {
            productsCopy = productsCopy.filter((item) =>
                subCategory.some((sub) => item.subCategory?.toLowerCase().trim() === sub.toLowerCase().trim())
            );
        }

        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        const sevenDaysAgo = today.getTime() - 7 * 24 * 60 * 60 * 1000;

        switch (sortType) {
            case "low-high":
                productsCopy.sort((a, b) => a.price - b.price);
                break;
            case "high-low":
                productsCopy.sort((a, b) => b.price - a.price);
                break;
            case "bestseller":
                productsCopy = productsCopy.filter((item) => item.bestseller);
                break;
            case "latest-today":
                productsCopy = productsCopy.filter((item) => item.date >= startOfToday);
                break;
            case "latest-7days":
                productsCopy = productsCopy.filter((item) => item.date >= sevenDaysAgo);
                break;
            default:
                break;
        }

        setFilterProducts(productsCopy);
    }, [products, category, subCategory, search, showSearch, sortType]);

    // Reset to page 1 when filters/search/sort change (but not on first load)
    const isFirstLoad = useRef(true);
    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            return;
        }
        setCurrentPage(1);
    }, [category, subCategory, search, showSearch, sortType]);

    const itemsPerPage = 12;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filterProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filterProducts.length / itemsPerPage);

    return (
        <>
            <div className="relative w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[285px]">
                <img src={assets.activewear} alt="Activewear" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-start px-6 sm:px-12">
                    <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wide">
                        ACTIVEWEAR
                    </h1>
                </div>
            </div>

            <div ref={productsRef} className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t border-white">
                {/* Filters */}
                <div className="min-w-60 text-white">
                    <p
                        onClick={() => setShowFilter(!showFilter)}
                        className="my-2 text-xl flex items-center cursor-pointer gap-2"
                    >
                        FILTERS
                        <img
                            className={`h-3 sm:hidden transition-transform ${
                                showFilter ? "rotate-[270deg]" : "rotate-0"
                            }`}
                            src={assets.dropdown_icon}
                            alt=""
                        />
                    </p>

                    {/* Category Filter */}
                    <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
                        <p className="mb-3 text-sm font-medium">CATEGORIES</p>
                        <div className="flex flex-col gap-2 text-sm font-light text-white">
                            {[
                                "Jersey Set",
                                "Tops & T-shirts",
                                "Shorts",
                                "Pants & Leggings",
                                "Hoodies",
                                "Jackets",
                                "P.E. Uniform",
                            ].map((cat) => (
                                <label key={cat} className="flex gap-2">
                                    <input
                                        type="checkbox"
                                        className="w-3 accent-red-500"
                                        value={cat}
                                        checked={category.includes(cat)}
                                        onChange={toggleCategory}
                                    />
                                    {cat}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Gender Filter */}
                    <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? "" : "hidden"} sm:block`}>
                        <p className="mb-3 text-sm font-medium">GENDER</p>
                        <div className="flex flex-col gap-2 text-sm font-light text-white">
                            <label className="flex gap-2">
                                <input
                                    type="checkbox"
                                    value="Men"
                                    checked={subCategory.includes("Men")}
                                    onChange={toggleSubCategory}
                                />
                                Men
                            </label>
                            <label className="flex gap-2">
                                <input
                                    type="checkbox"
                                    value="Women"
                                    checked={subCategory.includes("Women")}
                                    onChange={toggleSubCategory}
                                />
                                Women
                            </label>
                            <label className="flex gap-2">
                                <input
                                    type="checkbox"
                                    value="Unisex"
                                    checked={subCategory.includes("Unisex")}
                                    onChange={toggleSubCategory}
                                />
                                Unisex
                            </label>
                        </div>
                    </div>
                </div>

                {/* Products + Sorting */}
                <div className="flex-1">
                    <div className="flex justify-between text-base sm:text-2xl mb-4">
                        <p className="text-white text-sm sm:text-base mb-3">
                            {filterProducts.length > 0 ? (
                                <>
                                    Showing <span className="font-bold">{indexOfFirstItem + 1}</span> -{" "}
                                    <span className="font-bold">
                                        {Math.min(indexOfLastItem, filterProducts.length)}
                                    </span>{" "}
                                    of <span className="font-bold">{filterProducts.length}</span> products
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

                    {/* Product List */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6"
                        >
                            {currentItems.map((item, index) => (
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            scrollTarget={productsRef}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default Activewear;
