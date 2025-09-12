import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
    const { productId } = useParams();
    const { products, currency, addToCart } = useContext(ShopContext);
    const [productData, setProductData] = useState(false);
    const [image, setImage] = useState("");
    const [size, setSize] = useState("");

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
        <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
            {/* -------------- Product Data --------------*/}
            <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
                {/* ----------- Product Images --------------- */}
                <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
                    <div className="flex sm:flex-col overflow-hidden justify-between sm:justify-normal sm:w-[18.7%] w-full">
                        {productData.image.map((item, index) => (
                            <img
                                onClick={() => setImage(item)}
                                src={item}
                                key={index}
                                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                                alt=""
                            />
                        ))}
                    </div>
                    <div className="w-full sm:w-[80%]">
                        <img className="w-full h-auto" src={image} alt="" />
                    </div>
                </div>
                {/* -------------- Product Details -------------- */}
                <div className="flex-1 text-white">
                    <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
                    <div className="flex items-center gap-1 mt-2">
                        <img src={assets.star_icon} alt="" className="w-3 5" />
                        <img src={assets.star_icon} alt="" className="w-3 5" />
                        <img src={assets.star_icon} alt="" className="w-3 5" />
                        <img src={assets.star_icon} alt="" className="w-3 5" />
                        <img src={assets.star_dull} alt="" className="w-3 5" />
                        <p className="pl-2"></p>
                    </div>
                    <p className="mt-5 text-3xl font-medium">
                        {currency} {productData.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="mt-5 text-white/80 md:w-4/5">{productData.description}</p>
                    <div className="flex flex-col gap-4 my-8">
                        <p>Select Size</p>
                        <div className="flex gap-2">
                            {productData.sizes.map((item, index) => (
                                <button
                                    onClick={() => setSize(item)}
                                    className={`border border-black py-2 px-4 bg-red-500 cursor-pointer hover:bg-red-400 transition ${
                                        item === size ? "border-white" : ""
                                    }`}
                                    key={index}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={() => addToCart(productData._id, size)}
                        className="bg-white text-black px-8 py-3 text-sm border border-black font-bold hover:bg-red-400 active:bg-red-700 active:text-white transition"
                    >
                        ADD TO CART
                    </button>
                    <hr className="mt-8 sm:w-4/5" />
                    <div className="text-sm text-white/80 mt-5 flex flex-col gap-1">
                        <p>100% Original product.</p>
                        <p>Cash on delivery is available on this product.</p>
                        <p>Easy return and exchange policy within 7 days.</p>
                    </div>
                </div>
            </div>
            {/* ------------- Product Description & Reviews -------------- */}
            <div className="mt-20">
                <div className="flex text-white">
                    <b className="border px-5 py-3 text-sm">Description</b>
                    {/* <p className='border px-5 py-3 text-sm'>Reviews (122)</p> */}
                </div>
                <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-white/80">
                    <p>{productData.description}</p>
                </div>
            </div>
            {/* ------------- Related Products -------------- */}
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
