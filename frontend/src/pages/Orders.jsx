import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Orders = () => {
    const { backendUrl, token, currency } = useContext(ShopContext);
    const location = useLocation();

    const [orderData, setOrderData] = useState([]);

    // ✅ Load user orders
    const loadOrderData = async () => {
        try {
            if (!token) return;

            const response = await axios.post(`${backendUrl}/api/order/userorders`, {}, { headers: { token } });

            if (response.data.success) {
                // Flatten each order into individual items, include metadata
                const allOrdersItem = response.data.orders.flatMap((order) =>
                    order.items.map((item) => ({
                        ...item,
                        status: order.status,
                        payment: order.payment,
                        paymentMethod: order.paymentMethod,
                        date: order.date,
                        receiptUrl: order.receiptUrl,
                    }))
                );

                // ✅ Sort by latest date (most recent first)
                const sortedOrders = allOrdersItem.sort(
                    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                setOrderData(sortedOrders);
            }
        } catch (error) {
            console.error("Load Orders Error:", error);
        }
    };

    // Fetch orders when logged in
    useEffect(() => {
        loadOrderData();
    }, [token]);

    // Refresh orders when coming from another page
    useEffect(() => {
        if (location.state?.refresh) {
            loadOrderData();
        }
    }, [location.state]);

    // --- UI Helpers ---
    const getPaymentColor = (method) => {
        if (method === "Gcash") return "text-blue-500";
        if (method === "UnionBank") return "text-orange-500";
        return "text-gray-400";
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-500";
            case "Out for Delivery":
                return "bg-yellow-500";
            case "To Ship":
                return "bg-purple-500";
            case "Pending Verification":
                return "bg-blue-500";
            case "Declined":
                return "bg-red-500";
            default:
                return "bg-gray-400";
        }
    };

    const getPaymentStatusLabel = (payment, status) => {
        if (status === "Pending Verification") return "Pending Verification";
        if (status === "Declined") return "Declined";
        return payment ? "Verified" : "Not Verified";
    };

    // --- RENDER ---
    return (
        <div className="border-t pt-16 border-white min-h-screen">
            <div className="text-2xl">
                <Title text1="MY" text2="ORDERS" />
            </div>

            <div>
                {orderData.length === 0 ? (
                    <p className="text-center text-red-500 mt-10 text-lg font-medium">No orders found yet</p>
                ) : (
                    orderData.map((item, index) => (
                        <div
                            key={index}
                            className="py-4 border-t border-b text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                        >
                            <div className="flex items-start gap-6 text-sm">
                                <img className="w-16 sm:w-20 rounded-md" src={item.image[0]} alt={item.name} />
                                <div>
                                    <p className="sm:text-base font-medium">{item.name}</p>

                                    <div className="flex items-center flex-wrap gap-3 mt-1 text-base text-white/90">
                                        <p>
                                            {currency}{" "}
                                            {item.price.toLocaleString("en-PH", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </p>
                                        <p>Qty: {item.quantity}</p>
                                        <p>Size: {item.size}</p>
                                    </div>

                                    <p className="mt-1 text-white/90 text-sm">
                                        Date:{" "}
                                        <span className="text-gray-400">
                                            {new Date(item.date).toLocaleString("en-PH", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })}
                                        </span>
                                    </p>

                                    <p className="mt-1 text-white/90 text-sm">
                                        Payment Method:{" "}
                                        <span className={`${getPaymentColor(item.paymentMethod)} font-semibold`}>
                                            {item.paymentMethod}
                                        </span>
                                    </p>

                                    <p className="mt-1 text-sm">
                                        Payment Status:{" "}
                                        <span
                                            className={`font-semibold ${
                                                item.status === "Pending Verification"
                                                    ? "text-yellow-400"
                                                    : item.status === "Declined"
                                                    ? "text-red-500"
                                                    : item.payment
                                                    ? "text-green-500"
                                                    : "text-gray-400"
                                            }`}
                                        >
                                            {getPaymentStatusLabel(item.payment, item.status)}
                                        </span>
                                    </p>

                                    {item.receiptUrl && (
                                        <div className="mt-2">
                                            <a
                                                href={item.receiptUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block mt-1 px-3 py-1 border border-white/40 rounded-lg text-xs hover:bg-white hover:text-black transition"
                                            >
                                                View Receipt
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="md:w-1/2 flex justify-between md:justify-end items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className={`min-w-2 h-2 rounded-full ${getStatusColor(item.status)}`} />
                                    <p className="text-sm md:text-base">{item.status}</p>
                                </div>
                                <button
                                    onClick={loadOrderData}
                                    className="cursor-pointer flex items-center justify-center px-4 py-2 
                                        text-white border border-white rounded-lg 
                                        hover:bg-red-500 hover:border-red-500 transition duration-200 text-sm font-medium"
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Orders;
