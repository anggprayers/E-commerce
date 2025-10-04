import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import SizingChart from "./SizingChart";

const Product = () => {
    const { productId } = useParams();
    const { products, currency, addToCart } = useContext(ShopContext);
    const [productData, setProductData] = useState(false);
    const [image, setImage] = useState("");
    const [size, setSize] = useState("");
    const [frontName, setFrontName] = useState("");
    const [backName, setBackName] = useState("");
    const [jerseyNumber, setJerseyNumber] = useState("");

    const fetchProductData = () => {
        const found = products.find((item) => item._id === productId);
        if (found) {
            setProductData(found);
            setImage(found.image[0]);
        }
    };

    useEffect(() => {
        fetchProductData();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [productId, products]);

    return productData ? (
        <div className="border-t pt-10 transition-opacity ease-in duration-500 opacity-100 border-white">
            {/* Top-level: mobile = column (order controls), lg = grid (2 cols x 2 rows) */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:grid-rows-2 gap-12">
                {/* ---------- Images (mobile order-1, grid: row1 col1) ---------- */}
                <div className="order-1 lg:row-start-1 lg:col-start-1 flex flex-col gap-3">
                    <div className="flex sm:flex-row flex-col-reverse gap-3">
                        <div className="flex sm:flex-col overflow-hidden justify-between sm:justify-normal sm:w-[18.7%] w-full">
                            {productData.image.map((item, index) => (
                                <img
                                    onClick={() => setImage(item)}
                                    src={item}
                                    key={index}
                                    className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                                    alt={`${productData.name} ${index}`}
                                />
                            ))}
                        </div>
                        <div className="w-full sm:w-[80%]">
                            <img className="w-full h-auto" src={image} alt={productData.name} />
                        </div>
                    </div>
                </div>

                {/* ---------- Details (mobile order-2, grid: col2 spanning both rows) ---------- */}
                <div className="order-2 lg:row-start-1 lg:col-start-2 lg:row-span-2 flex-1 text-white">
                    <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
                    <SizingChart category={productData.category} gender={productData.subCategory} />

                    <p className="mt-5 text-3xl font-medium">
                        {currency} {productData.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </p>

                    {/* Sizes */}
                    <div className="flex flex-col gap-4 my-8">
                        <p>Select Size</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                            {productData.sizes.map((item, index) => (
                                <button
                                    onClick={() => setSize(item)}
                                    key={index}
                                    className={`min-w-[60px] sm:min-w-[70px] py-2 px-4 rounded-md border border-black bg-red-500 cursor-pointer 
                                        hover:bg-red-400 transition text-sm sm:text-base 
                                        ${item === size ? "border-white" : ""}`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Printed Inputs */}
                    <div className="flex flex-col gap-4 my-8">
                        <div>
                            <label className="block mb-1 text-sm">PRINTED NAME ON FRONT CHEST (Optional)</label>
                            <input
                                type="text"
                                maxLength={12}
                                value={frontName}
                                onChange={(e) => setFrontName(e.target.value)}
                                placeholder="Max 12 characters entry"
                                className="w-full p-2 border border-gray-400 rounded text-white"
                            />
                            <p className="text-xs text-gray-400 mt-1">{frontName.length}/12</p>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm">PRINTED NAME ON UPPER BACK (Optional)</label>
                            <input
                                type="text"
                                maxLength={25}
                                value={backName}
                                onChange={(e) => setBackName(e.target.value)}
                                placeholder="Max 25 characters entry"
                                className="w-full p-2 border border-gray-400 rounded text-white"
                            />
                            <p className="text-xs text-gray-400 mt-1">{backName.length}/25</p>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm">JERSEY NUMBER (Optional)</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={4}
                                value={jerseyNumber}
                                onChange={(e) => setJerseyNumber(e.target.value)}
                                placeholder="Max 4 characters entry"
                                className="w-full p-2 border border-gray-400 rounded text-white"
                            />
                            <p className="text-xs text-gray-400 mt-1">{jerseyNumber.length}/04</p>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <button
                        onClick={() => addToCart(productData._id, size, frontName, backName, jerseyNumber)}
                        className="bg-white text-black px-8 py-3 text-sm border border-black font-bold hover:bg-red-400 active:bg-red-700 active:text-white transition"
                    >
                        ADD TO CART
                    </button>

                    <hr className="mt-8 sm:w-4/5" />
                    <div className="text-sm text-white/80 mt-5 flex flex-col gap-1">
                        <p>100% Original product.</p>
                        <p>Easy return and exchange policy within 7 days.</p>
                    </div>
                </div>

                {/* ---------- Description (mobile order-3, grid: row2 col1 so it sits under images on lg) ---------- */}
                <div className="order-3 lg:row-start-2 lg:col-start-1 space-y-10 text-white">
                    <h2 className="text-xl font-semibold">Description</h2>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                        <li>
                            Our jerseys are made to order and can be fully personalized with your name, number, and
                            design preferences.
                        </li>
                        <li>Please refer to our sizing chart link located under the Product Name</li>
                        <li>
                            Premium Nike Fabric 200gsm designed with moisture-wicking, quick-dry technology and the
                            right thickness to keep you dry and comfortable all game long.
                        </li>
                        <li>
                            Built with professional-grade fabric and lasting comfort, these jerseys are designed to keep
                            athletes performing at their best.
                        </li>
                        <li className="font-semibold">
                            Note: Due to the custom nature of this product, all sales are final.
                        </li>
                    </ul>
                </div>
            </div>

            {/* Related Products */}
            <RelatedProducts
                category={productData.category}
                subCategory={productData.subCategory}
                currentProductId={productData._id}
            />
        </div>
    ) : (
        <div className="opacity-0"></div>
    );
};

export default Product;
