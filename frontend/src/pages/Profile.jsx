import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaRegHandPaper } from "react-icons/fa";
import Title from "../components/Title";

const Profile = () => {
    const { token, backendUrl, navigate, setToken } = useContext(ShopContext);

    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch user details
    const fetchUserDetails = async () => {
        try {
            const res = await axios.post(
                `${backendUrl}/api/user/details`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.data.success) {
                setUser(res.data.user);
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load user profile");
        }
    };

    // Fetch user orders
    const fetchUserOrders = async () => {
        try {
            const res = await axios.post(
                `${backendUrl}/api/order/user`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.data.success) {
                setOrders(res.data.orders || []);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered":
                return "text-green-500";
            case "Out for Delivery":
                return "text-yellow-500";
            default:
                return "text-gray-400";
        }
    };

    // Logout
    const handleLogout = () => {
        setToken("");
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        if (token) {
            fetchUserDetails();
            fetchUserOrders();
        } else {
            navigate("/login");
        }
    }, [token]);

    return (
        <div className="text-white min-h-screen py-10 border-t border-white">
            <div className="max-w-4xl mx-auto rounded-2xl p-6 shadow-lg border border-white">
                {/* User Info */}
                {user ? (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            {/* Left side: profile image + name */}
                            <div className="flex items-center gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-red-500 flex flex-wrap items-center gap-2 whitespace-wrap">
                                        <span>Welcome, {user.name}!</span>
                                        <FaRegHandPaper className="text-red-500 animate-wiggle text-2xl sm:text-3xl max-[450px]:hidden" />
                                    </h1>
                                    <p className="hidden text-gray-300 mt-2">Email: {user.email}</p>
                                </div>
                            </div>

                            {/* Right side: logout */}
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
                            >
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-400">Loading user details...</p>
                )}

                {/* Orders */}
                <div className="mt-14">
                    <div className="text-3xl mb-2">
                        <Title text1={"My"} text2={"Orders"} />
                    </div>

                    {loading ? (
                        <p className="text-gray-400">Loading orders...</p>
                    ) : orders.length > 0 ? (
                        <div className="space-y-4 cursor-pointer">
                            {orders.map((order, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => navigate("/orders")}
                                    className="bg-gray-900 border border-gray-700 rounded-xl p-4 hover:border-red-500 transition"
                                >
                                    <p className="text-lg font-medium text-white">Order #{order._id}</p>
                                    <p className="text-gray-400">
                                        Status:{" "}
                                        <span className={`${getStatusColor(order.status)} font-semibold`}>
                                            {order.status}
                                        </span>
                                    </p>
                                    <p className="text-gray-400">Total: ₱{order.amount.toLocaleString()}</p>
                                    <p className="text-gray-500 text-sm">
                                        {new Date(order.date).toLocaleDateString()}{" "}
                                        {new Date(order.date).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">You have no orders yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
