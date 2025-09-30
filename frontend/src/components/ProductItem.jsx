import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
    const { currency } = useContext(ShopContext);

    return (
        <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
            <div className="overflow-hidden">
                <img
                    src={image[0]}
                    alt={name}
                    width={300} // reserve space
                    height={300} // reserve space
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto aspect-square object-cover hover:scale-110 transition ease-in-out"
                />
                <p className="pt-3 pb-1 text-sm text-white">{name}</p>
                <p className="text-sm font-medium text-white/80">
                    {currency} {price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </p>
            </div>
        </Link>
    );
};

export default ProductItem;
