import React, { useState, useEffect, useRef } from "react";
import { sizingChart } from "../assets/sizingChart";

// Map categories + gender to sizing chart keys
const categoryKeyMap = {
    "Tops & T-shirts": "tshirt",
    Jackets: "jacket",
    Shorts: "basketball_short",
    "Pants & Leggings": "jogging_pants",
    "Jersey Set": "jersey_top",
    Hoodies: "hoodie",
};

const SizingChart = ({ category, gender }) => {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef(null);

    // Normalize gender (Men, Women, Unisex → lowercase key)
    const genderKey = gender?.toLowerCase();

    // Build the sizing chart key
    const categoryKey = categoryKeyMap[category] || "";
    const chartKey = categoryKey && genderKey ? `${categoryKey}_${genderKey}` : null;

    // Pick the right image, fallback to general
    const chartImage = sizingChart[chartKey] || sizingChart.generalChart;

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isOpen && modalRef.current && !modalRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="mt-3">
            {/* Trigger link */}
            <button
                onClick={() => setIsOpen(true)}
                className="text-sm text-red-400 underline hover:text-red-300 transition"
            >
                View Size Chart
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/70 flex justify-center items-center px-3">
                    <div ref={modalRef} className="bg-white rounded-lg overflow-hidden max-w-[95%] sm:max-w-3xl w-full">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-semibold text-black">Size Chart</h2>
                            <button onClick={() => setIsOpen(false)} className="text-black text-2xl hover:text-red-500">
                                &times;
                            </button>
                        </div>
                        <div className="p-6 flex justify-center">
                            <img src={chartImage} alt="Size chart" className="w-full max-h-[85vh] object-contain" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SizingChart;
