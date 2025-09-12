import React, { useRef } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Category = () => {
    const categories = [
        { src: assets.men_basketball, title: "Basketball", path: "/mens-basketball" },
        { src: assets.billiards, title: "Billiards", path: "/billiards" },
        { src: assets.volleyball, title: "Volleyball", path: "/volleyball" },
        { src: assets.activewear, title: "Activewear", path: "/activewear" },
        { src: assets.football, title: "Football", path: "/football" },
        { src: assets.soccer, title: "Soccer", path: "/soccer" },
        { src: assets.corporate, title: "Corporate", path: "/corporate" },
    ];

    const scrollRef = useRef(null);

    const navigate = useNavigate();

    const scrollLeft = () => {
        if (scrollRef.current) {
            const cardWidth = scrollRef.current.firstChild.getBoundingClientRect().width;
            scrollRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            const cardWidth = scrollRef.current.firstChild.getBoundingClientRect().width;
            scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
    };

    return (
        <div className="relative w-full px-2 sm:px-4 py-8">
            <h2 className="text-2xl font-semibold mb-6 text-white">Shop by Sport</h2>

            {/* Carousel with snap */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto scroll-smooth scrollbar-hide space-x-3 sm:space-x-4 md:space-x-5 p-x snap-mandatory"
            >
                {categories.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(item.path)}
                        className="min-w-[60%] sm:min-w-[30%] md:min-w-[23%] flex-shrink-0 snap-start"
                    >
                        <img
                            src={item.src}
                            alt={item.title}
                            className="w-full h-auto max-h-[600px] object-cover rounded-lg cursor-pointer"
                        />
                        <p className="mt-3 text-base sm:text-lg font-medium text-white/80">{item.title}</p>
                    </div>
                ))}
            </div>

            {/* Left Arrow */}
            <button
                onClick={scrollLeft}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-white rounded-full shadow-md p-2 cursor-pointer hover:bg-gray-300 hover:opacity-80 active:bg-gray-400 transition"
            >
                <BsChevronLeft size={20} />
            </button>

            {/* Right Arrow */}
            <button
                onClick={scrollRight}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-white rounded-full shadow-md p-2 cursor-pointer hover:bg-gray-300 hover:opacity-80 active:bg-gray-400 transition"
            >
                <BsChevronRight size={20} />
            </button>
        </div>
    );
};

export default Category;
