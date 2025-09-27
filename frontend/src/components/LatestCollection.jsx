import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            const now = new Date().getTime();
            const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

            // Filter only products within last 7 days
            const filtered = products.filter((item) => {
                const productDate = new Date(item.date).getTime(); // <-- make sure item.date exists
                return productDate >= sevenDaysAgo;
            });

            // Sort newest first
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Take only top 10 (optional)
            setLatestProducts(filtered.slice(0, 10));
        }
    }, [products]);

    return (
        <div className="my-10">
            <div className="text-center py-8 text-3xl">
                <Title text1={"LATEST"} text2={"COLLECTIONS"} />
                <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-white/80">
                    Explore the newest Kukz Sportswear arrivals — designed with innovation, comfort, and performance in
                    mind. From customized styles to sustainable activewear, our latest drops keep every athlete ready on
                    and off the game.
                </p>
            </div>
            {/* Rendering Products */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {latestProducts.length > 0 ? (
                    latestProducts.map((item, index) => (
                        <ProductItem
                            key={item._id || index}
                            id={item._id}
                            image={item.image}
                            name={item.name}
                            price={item.price}
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center text-white/70">No new products in the last 7 days.</p>
                )}
            </div>
        </div>
    );
};

export default LatestCollection;
