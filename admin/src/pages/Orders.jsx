import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
    const [orders, setOrders] = useState([]);
    const [filtered, setFiltered] = useState([]);

    // filters
    const [searchName, setSearchName] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Fetch all orders (sorted latest first)
    const fetchAllOrders = async () => {
        if (!token) return;
        try {
            const response = await axios.post(backendUrl + "/api/order/list", {}, { headers: { token } });
            if (response.data.success) {
                const data = [...response.data.orders].sort((a, b) => new Date(b.date) - new Date(a.date));
                setOrders(data);
                setFiltered(data);
            } else {
                toast.error("Unable to fetch orders. Please try again later.");
            }
        } catch (error) {
            console.error("Fetch Orders Error:", error);
            toast.error("Something went wrong while loading orders.");
        }
    };

    // Remove order
    const removeOrder = async (id) => {
        try {
            const response = await axios.post(backendUrl + "/api/order/remove", { id }, { headers: { token } });
            if (response.data.success) {
                toast.success("Order deleted successfully.");
                await fetchAllOrders();
            } else {
                toast.error("Unable to delete this order. Please try again.");
            }
        } catch (error) {
            console.error("Delete Order Error:", error);
            toast.error("Something went wrong while deleting the order.");
        }
    };

    // Confirm delete toast
    const confirmDelete = (id) => {
        toast(
            ({ closeToast }) => (
                <div className="flex flex-col gap-2">
                    <p>Are you sure you want to delete this order?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                removeOrder(id);
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

    // Update order status
    const statusHandler = async (status, orderId) => {
        try {
            const response = await axios.post(
                backendUrl + "/api/order/status",
                { orderId, status },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success("Order status updated.");
                await fetchAllOrders();
            } else {
                toast.error("Unable to update order status. Please try again.");
            }
        } catch (error) {
            console.error("Status Update Error:", error);
            toast.error("Something went wrong while updating the status.");
        }
    };

    // Confirm before changing status
    const confirmStatusChange = (newStatus, orderId, isPaid) => {
        if (!isPaid) {
            toast.info("Payment must be verified before changing the status.");
            return;
        }

        toast(
            ({ closeToast }) => (
                <div className="flex flex-col gap-2">
                    <p>
                        Change order status to <b>{newStatus}</b>?
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                statusHandler(newStatus, orderId);
                                closeToast();
                            }}
                            className="px-2 py-1 bg-green-600 text-white rounded"
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

    // Verify payment (auto set to "To Ship" when verified)
    const verifyPaymentHandler = async (orderId, currentState) => {
        const action = currentState ? "unverify" : "verify";

        toast(
            ({ closeToast }) => {
                let adminPassword = "";

                const handleVerify = async () => {
                    if (!adminPassword.trim()) {
                        toast.error("Please enter the admin password.");
                        return;
                    }

                    try {
                        const res = await axios.post(
                            backendUrl + "/api/order/payment",
                            { orderId, adminPass: adminPassword },
                            { headers: { token } }
                        );

                        if (res.data.success) {
                            toast.success(res.data.message || "Payment status updated.");
                            fetchAllOrders();
                        } else {
                            toast.error(res.data.message || "Failed to update payment status.");
                        }
                    } catch (err) {
                        console.error("Payment Toggle Error:", err);

                        if (err.response) {
                            if (err.response.status === 403) toast.error("Incorrect admin password.");
                            else if (err.response.status === 404) toast.error("Order not found.");
                            else toast.error("Server error occurred while verifying payment.");
                        } else {
                            toast.error("Network error. Please check your connection.");
                        }
                    }

                    closeToast();
                };

                return (
                    <div className="flex flex-col gap-2">
                        <p className="font-semibold text-sm">Enter admin password to {action} payment:</p>
                        <input
                            type="password"
                            placeholder="Enter password..."
                            className="border px-2 py-1 rounded text-sm"
                            onChange={(e) => (adminPassword = e.target.value)}
                        />
                        <div className="flex gap-2 justify-end mt-2">
                            <button
                                onClick={handleVerify}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => {
                                    toast.info("Verification cancelled.");
                                    closeToast();
                                }}
                                className="px-3 py-1 bg-gray-300 rounded text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                );
            },
            { autoClose: false }
        );
    };

    // filters
    const applyFilters = () => {
        let data = [...orders];

        if (searchName.trim() !== "") {
            data = data.filter((o) =>
                (o.address.firstName + " " + o.address.lastName).toLowerCase().includes(searchName.toLowerCase())
            );
        }

        if (searchDate) {
            data = data.filter(
                (o) => new Date(o.date).toLocaleDateString() === new Date(searchDate).toLocaleDateString()
            );
        }

        if (dateFrom) data = data.filter((o) => new Date(o.date) >= new Date(dateFrom));
        if (dateTo) data = data.filter((o) => new Date(o.date) <= new Date(dateTo));

        // ✅ Keep latest orders first after filtering
        data.sort((a, b) => new Date(b.date) - new Date(a.date));

        setFiltered(data);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchName("");
        setSearchDate("");
        setDateFrom("");
        setDateTo("");
        setFiltered(orders);
        setCurrentPage(1);
    };

    useEffect(() => {
        fetchAllOrders();
    }, [token]);

    useEffect(() => {
        applyFilters();
    }, [searchName, searchDate, dateFrom, dateTo, orders]);

    // pagination slice
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentItems = filtered.slice(startIndex, endIndex);

    return (
        <div>
            <h3 className="text-xl font-bold mb-3">Orders</h3>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Search by customer's name..."
                    className="border px-2 py-1 rounded w-full sm:w-auto"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <label className="text-sm font-medium text-gray-600">Date:</label>
                    <input
                        type="date"
                        className="border px-2 py-1 rounded"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                    />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <label className="text-sm font-medium text-gray-600">From:</label>
                    <input
                        type="date"
                        className="border px-2 py-1 rounded"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                    />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <label className="text-sm font-medium text-gray-600">To:</label>
                    <input
                        type="date"
                        className="border px-2 py-1 rounded"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                    />
                </div>

                <button
                    onClick={clearFilters}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-semibold"
                >
                    Clear Filters
                </button>
            </div>

            {/* Orders List */}
            {currentItems.map((order, index) => (
                <div
                    key={index}
                    className="flex flex-col lg:grid lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-4 items-start border-2 border-gray-200 p-4 my-3 text-xs sm:text-sm text-gray-700 bg-white rounded"
                >
                    <img
                        className="w-24 h-24 object-cover rounded"
                        src={order.items[0].image?.[0] || assets.parcel_icon}
                        alt={order.items[0].name}
                    />

                    <div>
                        <div className="text-lg">
                            {order.items.map((item, idx) => (
                                <p className="py-0.5 font-extrabold" key={idx}>
                                    {item.quantity} {item.size} {item.name}
                                </p>
                            ))}
                        </div>
                        <p className="mt-2 mb-1 font-bold">
                            Name: {order.address.firstName + " " + order.address.lastName}
                        </p>
                        <p>Street: {order.address.street}</p>
                        <p>
                            City: {order.address.city}, {order.address.country}, {order.address.zipcode}
                        </p>
                        <p>Phone: {order.address.phone}</p>
                    </div>

                    <div>
                        <p className="mt-0 sm:mt-0 md:mt-10">Date: {new Date(order.date).toLocaleDateString()}</p>
                        <p className="text-sm">
                            Time:{" "}
                            {new Date(order.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                        <p className="text-sm font-semibold">
                            Method:{" "}
                            <span
                                className={`${
                                    order.paymentMethod === "UnionBank"
                                        ? "text-orange-500"
                                        : order.paymentMethod === "Gcash"
                                        ? "text-blue-500"
                                        : ""
                                }`}
                            >
                                {order.paymentMethod}
                            </span>
                        </p>

                        <p className="text-sm">
                            Payment:{" "}
                            <span className={`font-semibold ${order.payment ? "text-green-600" : "text-red-600"}`}>
                                {order.payment ? "Verified" : "Pending"}
                            </span>
                        </p>

                        {order.receiptUrl && (
                            <a
                                href={order.receiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-xs mt-1 block"
                            >
                                View Receipt
                            </a>
                        )}
                    </div>

                    <div className="flex flex-col items-start justify-center gap-2">
                        <p className="font-extrabold text-sm sm:text-[15px]">
                            {currency} {order.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                        </p>

                        {!order.payment && (
                            <button
                                onClick={() => verifyPaymentHandler(order._id, order.payment)}
                                className={`px-3 py-1 rounded text-white text-xs ${
                                    order.payment ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                                }`}
                            >
                                {order.payment ? "Unverify Payment" : "Verify Payment"}
                            </button>
                        )}
                    </div>

                    {/* Status + Delete */}
                    <div className="flex items-center justify-between w-full gap-2">
                        <select
                            onChange={(e) => confirmStatusChange(e.target.value, order._id, order.payment)}
                            value={order.status}
                            className="p-1 font-semibold border rounded text-xs w-[120px]"
                        >
                            <option value="Pending Verification">Pending</option>
                            <option value="To Ship">To Ship</option>
                            <option value="Out for Delivery">Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Declined">Declined</option>
                        </select>

                        <button
                            onClick={() => confirmDelete(order._id)}
                            className="hover:bg-red-400 rounded transition p-1"
                            title="Delete Order"
                        >
                            <img
                                src={assets.delete_icon}
                                alt="Delete"
                                className="w-4 h-4 cursor-pointer hover:scale-110 transition"
                            />
                        </button>
                    </div>
                </div>
            ))}

            {/* Pagination */}
            {totalItems > itemsPerPage && (
                <div className="flex justify-center gap-2 mt-6">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className={`px-3 py-1 border rounded ${
                            currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"
                        }`}
                    >
                        Prev
                    </button>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
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

export default Orders;
