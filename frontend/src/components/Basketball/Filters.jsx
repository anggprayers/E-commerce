import React from "react";
import { assets } from "../../assets/assets";

const Filters = ({ showFilter, setShowFilter, category, setCategory, subCategory, setSubCategory }) => {
    const toggle = (list, setList, value) =>
        list.includes(value) ? setList((prev) => prev.filter((v) => v !== value)) : setList((prev) => [...prev, value]);

    return (
        <div className="min-w-60 text-white">
            <p
                onClick={() => setShowFilter(!showFilter)}
                className="my-2 text-xl flex items-center cursor-pointer gap-2"
            >
                FILTERS
                <img
                    className={`h-3 sm:hidden transition-transform ${showFilter ? "rotate-[270deg]" : "rotate-0"}`}
                    src={assets.dropdown_icon}
                    alt=""
                />
            </p>

            {/* Categories */}
            <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
                <p className="mb-3 text-sm font-medium">CATEGORIES</p>
                {[
                    "Jersey Set",
                    "Tops & T-shirts",
                    "Shorts",
                    "Pants & Leggings",
                    "Hoodies",
                    "Jackets",
                    "P.E. Uniform",
                ].map((cat) => (
                    <label key={cat} className="flex gap-2 text-sm font-light">
                        <input
                            type="checkbox"
                            className="w-3 accent-red-500"
                            checked={category.includes(cat)}
                            onChange={() => toggle(category, setCategory, cat)}
                        />
                        {cat}
                    </label>
                ))}
            </div>

            {/* Gender */}
            <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? "" : "hidden"} sm:block`}>
                <p className="mb-3 text-sm font-medium">TYPE</p>
                {["Men", "Women", "Unisex"].map((gen) => (
                    <label key={gen} className="flex gap-2 text-sm font-light">
                        <input
                            type="checkbox"
                            checked={subCategory.includes(gen)}
                            onChange={() => toggle(subCategory, setSubCategory, gen)}
                        />
                        {gen}
                    </label>
                ))}
            </div>
        </div>
    );
};

export default Filters;
