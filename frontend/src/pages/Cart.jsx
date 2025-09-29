import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { confirmToast } from "../utils/confirmToast";

const Cart = () => {
    const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
    const [cartData, setCartData] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            const tempData = [];
            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    const entry = cartItems[items][item];
                    if (entry && entry.quantity > 0) {
                        tempData.push({
                            _id: items,
                            size: item,
                            quantity: entry.quantity,
                            frontName: entry.frontName || "",
                            backName: entry.backName || "",
                            jerseyNumber: entry.jerseyNumber || "",
                        });
                    }
                }
            }
            setCartData(tempData);
        }
    }, [cartItems, products]);

    return (
        <div className="border-t pt-14 border-white">
            <div className="text-2xl mb-3">
                <Title text1={"YOUR"} text2={"CART"} />
            </div>

            {/* === Header Row === */}
            {cartData.length > 0 && (
                <div className="grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] gap-4 px-2 sm:px-4 py-2 border-b text-sm sm:text-base font-semibold text-white/70">
                    <p>Product</p>
                    <p className="text-center">Quantity</p>
                    <p className="text-center">Remove</p>
                </div>
            )}

            {/* === Cart Items === */}
            <div>
                {cartData.map((item, index) => {
                    const productData = products.find((product) => product._id === item._id);
                    return (
                        <div
                            key={index}
                            className="py-4 border-b text-white grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                        >
                            {/* Product Info */}
                            <div className="flex items-start gap-6">
                                <img className="w-16 sm:w-20" src={productData.image[0]} alt="" />
                                <div>
                                    <p className="text-xs sm:text-lg font-bold text-white">{productData.name}</p>
                                    {item.frontName && (
                                        <p className="text-sm text-gray-400 font-medium">
                                            Front Name: {item.frontName}
                                        </p>
                                    )}
                                    {item.backName && (
                                        <p className="text-sm text-gray-400 font-medium">Back Name: {item.backName}</p>
                                    )}
                                    {item.jerseyNumber && (
                                        <p className="text-sm text-gray-400 font-medium">
                                            Jersey Number: {item.jerseyNumber}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-5 mt-4">
                                        <p>
                                            {currency}{" "}
                                            {productData.price.toLocaleString("en-PH", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </p>
                                        <p className="px-2 sm:px-3 sm:py-1 border bg-red-500 text-white">{item.size}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity Input */}
                            <input
                                onChange={(e) =>
                                    e.target.value === "" || e.target.value === "0"
                                        ? null
                                        : updateQuantity(item._id, item.size, Number(e.target.value))
                                }
                                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 text-center bg-transparent mx-auto"
                                type="number"
                                min={1}
                                defaultValue={item.quantity}
                            />

                            {/* Remove Button */}
                            <img
                                onClick={() =>
                                    confirmToast("Remove this item from your cart?", () =>
                                        updateQuantity(item._id, item.size, 0)
                                    )
                                }
                                className="w-4 sm:w-5 cursor-pointer mx-auto"
                                src={assets.bin_icon}
                                alt="Remove"
                            />
                        </div>
                    );
                })}
            </div>

            {/* Cart Totals */}
            <div className="flex justify-end my-20">
                <div className="w-full sm:w-[450px]">
                    <CartTotal />
                    <div className="w-full text-end">
                        <button
                            onClick={() => navigate("/place-order")}
                            className="bg-white text-black font-medium text-sm my-8 px-8 py-3 active:bg-red-700 cursor-pointer hover:bg-red-700 transition"
                        >
                            PROCEED TO CHECKOUT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
