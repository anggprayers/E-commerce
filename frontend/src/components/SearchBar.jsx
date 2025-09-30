import React, { useContext, useEffect, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const categories = [
    { src: assets.men_basketball, title: "Basketball", path: "/mens-basketball" },
    { src: assets.billiards, title: "Billiards", path: "/billiards" },
    { src: assets.volleyball, title: "Volleyball", path: "/volleyball" },
    { src: assets.activewear, title: "Activewear", path: "/activewear" },
    { src: assets.football, title: "Football", path: "/football" },
    { src: assets.soccer, title: "Soccer", path: "/soccer" },
    { src: assets.corporate, title: "Corporate", path: "/corporate" },
];

const SearchBar = () => {
    const { search, setSearch, searchResults, showSearch, setShowSearch } = useContext(ShopContext);
    const ref = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setShowSearch(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowSearch]);

    if (!showSearch) return null;

    return (
        <div
            ref={ref}
            className={`fixed top-16 left-0 w-full flex justify-center z-50 transition-all duration-300 ${
                showSearch ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
        >
            <div className="w-3/4 sm:w-1/2 bg-gray-900 rounded-lg shadow-lg p-3 text-white transform transition-transform duration-300">
                {/* Search Input */}
                <div className="flex items-center border border-gray-700 rounded-full px-4 py-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products, categories..."
                        className="flex-1 outline-none bg-transparent text-sm placeholder-gray-400 text-white"
                    />
                    <img className="w-4 cursor-pointer" src={assets.search_icon} alt="search" />
                </div>

                {/* Category Suggestions */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                    {categories
                        .filter((cat) => cat.title.toLowerCase().includes(search.toLowerCase()))
                        .map((cat, idx) => (
                            <div
                                key={idx}
                                onClick={() => {
                                    navigate(cat.path);
                                    setShowSearch(false);
                                    setSearch("");
                                }}
                                className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 cursor-pointer"
                            >
                                <img src={cat.src} alt={cat.title} className="w-6 h-6 object-contain" />
                                <span>{cat.title}</span>
                            </div>
                        ))}
                </div>

                {/* Product/Order Results */}
                {searchResults.length > 0 && (
                    <div className="mt-3 max-h-60 overflow-y-auto border-t border-gray-700 pt-2">
                        {searchResults.map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => {
                                    if (item.name) navigate(`/product/${item._id}`);
                                    if (item.id && !item.name) navigate(`/order/${item.id}`);
                                    setShowSearch(false);
                                    setSearch("");
                                }}
                                className="flex justify-between p-2 hover:bg-gray-800 cursor-pointer rounded"
                            >
                                <span>{item.name || `Order #${item.id}`}</span>
                                {item.price && (
                                    <span className="text-gray-400">₱{Number(item.price).toLocaleString()}</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {search &&
                    searchResults.length === 0 &&
                    categories.filter((cat) => cat.title.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                        <p className="text-center text-gray-500 mt-2">No results found</p>
                    )}
            </div>
        </div>
    );
};

export default SearchBar;
