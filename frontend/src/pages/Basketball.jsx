import React, { useContext, useEffect, useState, useRef, lazy } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Pagination from "../components/Pagination";
import Banner from "../components/Basketball/Banner.jsx";
import Filters from "../components/Basketball/Filters";
import SortingBar from "../components/Basketball/SortingBar";
import ProductGrid from "../components/Basketball/ProductGrid";

const ProductItem = lazy(() => import("../components/ProductItem"));

const Basketball = () => {
    const { products, search, showSearch } = useContext(ShopContext);

    // state
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);

    const [sortType, setSortType] = useState(() => sessionStorage.getItem("basketballSortType") || "relevant");
    const [currentPage, setCurrentPage] = useState(
        () => parseInt(sessionStorage.getItem("basketballCurrentPage"), 10) || 1
    );
    const [category, setCategory] = useState(() => JSON.parse(sessionStorage.getItem("basketballCategory")) || []);
    const [subCategory, setSubCategory] = useState(
        () => JSON.parse(sessionStorage.getItem("basketballSubCategory")) || []
    );

    const productsRef = useRef(null);

    // Persist states
    useEffect(() => sessionStorage.setItem("basketballCategory", JSON.stringify(category)), [category]);
    useEffect(() => sessionStorage.setItem("basketballSubCategory", JSON.stringify(subCategory)), [subCategory]);
    useEffect(() => sessionStorage.setItem("basketballCurrentPage", currentPage), [currentPage]);
    useEffect(() => sessionStorage.setItem("basketballSortType", sortType), [sortType]);

    // Cleanup
    useEffect(() => {
        return () => {
            ["basketballCategory", "basketballSubCategory", "basketballCurrentPage", "basketballSortType"].forEach(
                (key) => sessionStorage.removeItem(key)
            );
        };
    }, []);

    // Filtering
    useEffect(() => {
        let copy = products.filter((p) => p.sportsCategory?.toLowerCase() === "basketball");

        if (showSearch && search)
            copy = copy.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase().trim()));

        if (category.length) copy = copy.filter((p) => category.includes(p.category));
        if (subCategory.length) copy = copy.filter((p) => subCategory.includes(p.subCategory));

        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        const sevenDaysAgo = today.getTime() - 7 * 24 * 60 * 60 * 1000;

        switch (sortType) {
            case "low-high":
                copy.sort((a, b) => a.price - b.price);
                break;
            case "high-low":
                copy.sort((a, b) => b.price - a.price);
                break;
            case "bestseller":
                copy = copy.filter((p) => p.bestseller);
                break;
            case "latest-today":
                copy = copy.filter((p) => p.date >= startOfToday);
                break;
            case "latest-7days":
                copy = copy.filter((p) => p.date >= sevenDaysAgo);
                break;
            default:
                break;
        }

        setFilterProducts(copy);
    }, [products, category, subCategory, search, showSearch, sortType]);

    // Reset page on filter change
    const isFirstLoad = useRef(true);
    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            return;
        }
        setCurrentPage(1);
    }, [category, subCategory, search, showSearch, sortType]);

    // Pagination
    const itemsPerPage = 12;
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filterProducts.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filterProducts.length / itemsPerPage);

    return (
        <>
            <Banner baseImg={assets.men_basketball} />
            <div ref={productsRef} className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t border-white">
                <Filters
                    showFilter={showFilter}
                    setShowFilter={setShowFilter}
                    category={category}
                    setCategory={setCategory}
                    subCategory={subCategory}
                    setSubCategory={setSubCategory}
                />
                <div className="flex-1">
                    <SortingBar
                        filterProducts={filterProducts}
                        indexOfFirst={indexOfFirst}
                        indexOfLast={indexOfLast}
                        sortType={sortType}
                        setSortType={setSortType}
                    />
                    <ProductGrid items={currentItems} ProductItem={ProductItem} currentPage={currentPage} />
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

export default Basketball;
