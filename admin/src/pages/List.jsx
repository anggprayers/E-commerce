import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const List = ({ token }) => {
    const [list, setList] = useState([]);
    const [filtered, setFiltered] = useState([]);

    // filters
    const [search, setSearch] = useState("");
    const [sportsFilter, setSportsFilter] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // product display limiter per page

    const fetchList = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/product/list");
            if (response.data.success) {
                setList(response.data.products);
                setFiltered(response.data.products);
            } else {
                toast.error("Failed to fetch products. Please try again later.", {
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.", { autoClose: 3000 });
        }
    };

    const removeProduct = async (id) => {
        try {
            const response = await axios.post(backendUrl + "/api/product/remove", { id }, { headers: { token } });

            if (response.data.success) {
                toast.success("Product removed successfully.", { autoClose: 3000 });
                await fetchList();
            } else {
                toast.error("Unable to remove product. Please try again.", { autoClose: 3000 });
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.", { autoClose: 3000 });
        }
    };

    const confirmDelete = (id) => {
        toast(
            ({ closeToast }) => (
                <div className="flex flex-col gap-2">
                    <p>Are you sure you want to delete this product?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                removeProduct(id);
                                closeToast();
                            }}
                            className="px-2 py-1 bg-red-500 text-white rounded"
                        >
                            Yes
                        </button>
                        <button onClick={closeToast} className="px-2 py-1 bg-gray-300 rounded">
                            No
                        </button>
                    </div>
                </div>
            ),
            { autoClose: false }
        );
    };

    const applyFilters = () => {
        let data = [...list];

        if (search.trim() !== "") {
            data = data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
        }

        if (sportsFilter) {
            data = data.filter((item) => item.sportsCategory === sportsFilter);
        }

        if (minPrice) {
            data = data.filter((item) => item.price >= parseFloat(minPrice));
        }

        if (maxPrice) {
            data = data.filter((item) => item.price <= parseFloat(maxPrice));
        }

        setFiltered(data);
        setCurrentPage(1); // reset to first page after filter
    };

    const clearFilters = () => {
        setSearch("");
        setSportsFilter("");
        setMinPrice("");
        setMaxPrice("");
        setFiltered(list);
        setCurrentPage(1);
    };

    useEffect(() => {
        fetchList();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [search, sportsFilter, minPrice, maxPrice, list]);

    // pagination slice
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentItems = filtered.slice(startIndex, endIndex);

    return (
        <div className="w-full">
            {/* Top Info */}
            <div className="flex justify-between items-center mb-3">
                <p className="text-lg font-semibold text-gray-700">
                    Showing {startIndex + 1}–{endIndex} of {totalItems} products
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Search name..."
                    className="border px-2 py-1 rounded w-full sm:w-auto"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    value={sportsFilter}
                    onChange={(e) => setSportsFilter(e.target.value)}
                    className="border px-2 py-1 rounded w-full sm:w-auto"
                >
                    <option value="">All Sports</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Billiards">Billiards</option>
                    <option value="Volleyball">Volleyball</option>
                    <option value="Activewear">Activewear</option>
                    <option value="Football">Football</option>
                    <option value="Soccer">Soccer</option>
                    <option value="Corporate">Corporate</option>
                </select>
                <input
                    type="number"
                    placeholder="Min Price"
                    className="border px-2 py-1 rounded w-full sm:w-[130px]"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    className="border px-2 py-1 rounded w-full sm:w-[130px]"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
                <button
                    onClick={clearFilters}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-semibold"
                >
                    Clear Filters
                </button>
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                        <div key={item._id} className="border rounded-lg p-3 flex flex-col gap-2 bg-white shadow-sm">
                            <img src={item.image[0]} alt={item.name} className="w-full h-full object-cover rounded" />
                            <div className="flex flex-col gap-1">
                                <p className="font-medium truncate text-red-600">{item.name}</p>
                                <p className="text-sm text-gray-500">{item.sportsCategory}</p>
                                <p className="text-black font-semibold">
                                    {currency}{" "}
                                    {item.price.toLocaleString("en-PH", {
                                        minimumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                            <div className="flex justify-end gap-3 mt-2">
                                <div className="group">
                                    <img
                                        src={assets.edit_icon}
                                        alt="Edit"
                                        className="w-5 h-5 cursor-pointer transition group-hover:scale-110 group-hover:brightness-75"
                                        onClick={() => (window.location.href = `/edit/${item._id}`)}
                                    />
                                </div>
                                <div className="group">
                                    <img
                                        src={assets.delete_icon}
                                        alt="Delete"
                                        className="w-5 h-5 cursor-pointer transition group-hover:scale-110 group-hover:brightness-75"
                                        onClick={() => confirmDelete(item._id)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No products found.</p>
                )}
            </div>

            {/* Pagination Controls at Bottom */}
            {totalItems > itemsPerPage && (
                <div className="flex justify-center gap-2 mt-6">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className={`px-3 py-1 border rounded ${
                            currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"
                        }`}
                    >
                        Prev
                    </button>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className={`px-3 py-1 border rounded ${
                            currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default List;
