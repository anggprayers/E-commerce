import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Pagination from "../components/Pagination";
import CloudinaryImage from "../components/CloudinaryImage";
import Filters from "../components/Filters";
import SortSelect from "../components/SortSelect";
import ProductList from "../components/ProductList";

const SportsCategoryPage = ({ title, categoryKey, bannerImg }) => {
    const { products, search, showSearch } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [sortType, setSortType] = useState(() => sessionStorage.getItem(`${categoryKey}SortType`) || "relevant");
    const [currentPage, setCurrentPage] = useState(
        () => parseInt(sessionStorage.getItem(`${categoryKey}CurrentPage`), 10) || 1
    );
    const [category, setCategory] = useState(() => JSON.parse(sessionStorage.getItem(`${categoryKey}Category`)) || []);
    const [subCategory, setSubCategory] = useState(
        () => JSON.parse(sessionStorage.getItem(`${categoryKey}SubCategory`)) || []
    );

    // Persist states
    useEffect(() => sessionStorage.setItem(`${categoryKey}Category`, JSON.stringify(category)), [category]);
    useEffect(() => sessionStorage.setItem(`${categoryKey}SubCategory`, JSON.stringify(subCategory)), [subCategory]);
    useEffect(() => sessionStorage.setItem(`${categoryKey}CurrentPage`, currentPage), [currentPage]);
    useEffect(() => sessionStorage.setItem(`${categoryKey}SortType`, sortType), [sortType]);

    // Clear session on unmount
    useEffect(() => {
        return () => {
            ["Category", "SubCategory", "CurrentPage", "SortType"].forEach((key) =>
                sessionStorage.removeItem(`${categoryKey}${key}`)
            );
        };
    }, [categoryKey]);

    const productsRef = useRef(null);

    // ✅ useMemo for filtering/sorting (no recalculation unless deps change)
    const filterProducts = useMemo(() => {
        let filtered = products.filter((item) => item.sportsCategory?.toLowerCase().trim() === categoryKey);

        if (showSearch && search) {
            filtered = filtered.filter((item) => item.name?.toLowerCase().includes(search.toLowerCase().trim()));
        }

        if (category.length > 0) {
            filtered = filtered.filter((item) =>
                category.some((cat) => item.category?.toLowerCase().trim() === cat.toLowerCase().trim())
            );
        }

        if (subCategory.length > 0) {
            filtered = filtered.filter((item) =>
                subCategory.some((sub) => item.subCategory?.toLowerCase().trim() === sub.toLowerCase().trim())
            );
        }

        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        const sevenDaysAgo = today.getTime() - 7 * 24 * 60 * 60 * 1000;

        switch (sortType) {
            case "low-high":
                return [...filtered].sort((a, b) => a.price - b.price);
            case "high-low":
                return [...filtered].sort((a, b) => b.price - a.price);
            case "bestseller":
                return filtered.filter((item) => item.bestseller);
            case "latest-today":
                return filtered.filter((item) => item.date >= startOfToday);
            case "latest-7days":
                return filtered.filter((item) => item.date >= sevenDaysAgo);
            default:
                return filtered;
        }
    }, [products, category, subCategory, search, showSearch, sortType, categoryKey]);

    // Reset page when filters/sort/search change
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
            {/* Banner */}
            <div className="relative w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[285px] border-t border-white overflow-hidden">
                <CloudinaryImage
                    baseUrl={bannerImg}
                    alt={`${title} Banner`}
                    widths={[768, 1280, 1920]}
                    desiredHeight={700}
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                    fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-start px-6 sm:px-12">
                    <h1 className="text-white font-extrabold tracking-wide text-4xl sm:text-5xl md:text-6xl leading-none">
                        {title.toUpperCase()}
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div ref={productsRef} className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t border-white">
                <Filters
                    showFilter={showFilter}
                    setShowFilter={setShowFilter}
                    category={category}
                    subCategory={subCategory}
                    toggleCategory={(e) =>
                        setCategory((prev) =>
                            prev.includes(e.target.value)
                                ? prev.filter((item) => item !== e.target.value)
                                : [...prev, e.target.value]
                        )
                    }
                    toggleSubCategory={(e) =>
                        setSubCategory((prev) =>
                            prev.includes(e.target.value)
                                ? prev.filter((item) => item !== e.target.value)
                                : [...prev, e.target.value]
                        )
                    }
                />

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

                        <SortSelect sortType={sortType} setSortType={setSortType} />
                    </div>

                    <ProductList currentItems={currentItems} currentPage={currentPage} />

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

export default SportsCategoryPage;
