import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
    const [method, setMethod] = useState("COD");
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, products } = useContext(ShopContext);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        barangay: "",
        city: "",
        zipcode: "",
        country: "",
        phone: "",
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setFormData((data) => ({ ...data, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            let orderItems = [];
            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find((product) => product._id === items));
                        if (itemInfo) {
                            itemInfo.size = item;
                            itemInfo.quantity = cartItems[items][item];
                            orderItems.push(itemInfo);
                        }
                    }
                }
            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount(),
            };

            switch (method) {
                case "COD":
                    const response = await axios.post(backendUrl + "/api/order/place", orderData, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (response.data.success) {
                        // Clear cart locally and on backend
                        setCartItems({});
                        localStorage.removeItem("cartItems");
                        await axios.post(
                            `${backendUrl}/api/cart/clear`,
                            {},
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        toast.success(response.data.message);
                        navigate("/orders", { state: { refresh: true } });
                    } else {
                        toast.error(response.data.message);
                    }
                    break;

                case "Gcash":
                    const res = await axios.post(`${backendUrl}/api/order/gcash`, orderData, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (res.data.success && res.data.checkoutUrl) {
                        // Persist token before redirecting
                        localStorage.setItem("token", token);

                        // Clear cart locally
                        setCartItems({});
                        localStorage.removeItem("cartItems");

                        // Redirect to GCash checkout
                        window.location.href = res.data.checkoutUrl;
                    } else {
                        toast.error(res.data.message || "GCash checkout failed");
                    }
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    return (
        <form
            onSubmit={onSubmitHandler}
            className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t border-white"
        >
            {/* --------- Left Side --------- */}
            <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                <div className="text-xl sm:text-2xl my-3">
                    <Title text1={"DELIVERY"} text2={"INFORMATION"} />
                </div>
                <div className="flex gap-3">
                    <input
                        required
                        onChange={onChangeHandler}
                        name="firstName"
                        value={formData.firstName}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full placeholder:text-gray-500 text-white/90"
                        type="text"
                        placeholder="First Name"
                    />
                    <input
                        required
                        onChange={onChangeHandler}
                        name="lastName"
                        value={formData.lastName}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full placeholder:text-gray-500 text-white/90"
                        type="text"
                        placeholder="Last Name"
                    />
                </div>
                <input
                    required
                    onChange={onChangeHandler}
                    name="email"
                    value={formData.email}
                    className="border border-gray-300 rounded py-1.5 px-3.5 w-full placeholder:text-gray-500 text-white/90"
                    type="email"
                    placeholder="Email Address"
                />
                <input
                    required
                    onChange={onChangeHandler}
                    name="street"
                    value={formData.street}
                    className="border border-gray-300 rounded py-1.5 px-3.5 w-full placeholder:text-gray-500 text-white/90"
                    type="text"
                    placeholder="Street"
                />
                <div className="flex gap-3">
                    <input
                        required
                        onChange={onChangeHandler}
                        name="barangay"
                        value={formData.barangay}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full placeholder:text-gray-500 text-white/90"
                        type="text"
                        placeholder="Barangay"
                    />
                    <input
                        required
                        onChange={onChangeHandler}
                        name="city"
                        value={formData.city}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full placeholder:text-gray-500 text-white/90"
                        type="text"
                        placeholder="City"
                    />
                </div>
                <div className="flex gap-3">
                    <input
                        required
                        onChange={onChangeHandler}
                        name="zipcode"
                        value={formData.zipcode}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full placeholder:text-gray-500 text-white/90"
                        type="number"
                        placeholder="Zipcode"
                    />
                    <input
                        required
                        onChange={onChangeHandler}
                        name="country"
                        value={formData.country}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full placeholder:text-gray-500 text-white/90"
                        type="text"
                        placeholder="Country"
                    />
                </div>
                <input
                    required
                    onChange={onChangeHandler}
                    name="phone"
                    value={formData.phone}
                    className="border border-gray-300 rounded py-1.5 px-3.5 w-full placeholder:text-gray-500 text-white/90"
                    type="number"
                    placeholder="Phone"
                />
            </div>
            {/* --------- Right Side --------- */}
            <div className="mt-8">
                <div className="mt-8 min-w-80">
                    <CartTotal />
                </div>
                <div className="mt-12">
                    <Title text1={"PAYMENT"} text2={"METHOD"} />
                    {/* -------- PAYMENT METHOD --------- */}
                    <div className="flex gap-3 flex-col lg:flex-row">
                        <div
                            onClick={() => setMethod("COD")}
                            className="flex items-center gap-3 border bg-white border-black p-2 px-3 cursor-pointer"
                        >
                            <p
                                className={`min-w-3.5 h-3.5 border rounded-full ${
                                    method === "COD" ? "bg-green-500" : ""
                                }`}
                            ></p>
                            <p className="text-black text-sm font-medium mx-4"> Cash on Delivery</p>
                        </div>
                        <div
                            onClick={() => setMethod("Gcash")}
                            className="flex items-center gap-3 border bg-blue-500 border-black p-2 px-3 cursor-pointer"
                        >
                            <p
                                className={`min-w-3.5 h-3.5 border rounded-full ${
                                    method === "Gcash" ? "bg-green-500" : ""
                                }`}
                            ></p>
                            <img className="h-5 mx-4" src={assets.gcash_icon} alt="" />
                        </div>
                    </div>
                    <div className="w-full text-end mt-8">
                        <button className="bg-white text-black font-medium px-16 py-3 text-sm hover:bg-red-700 transition active:bg-red-700">
                            PLACE ORDER
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;
