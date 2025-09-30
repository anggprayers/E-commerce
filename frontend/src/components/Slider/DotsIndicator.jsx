import React from "react";
import { RxDotFilled } from "react-icons/rx";

const DotsIndicator = ({ currentIndex, sliderImages, goToSlide, currentTitle }) => (
    <div className="relative flex flex-col items-center justify-center py-2">
        <div className="flex space-x-2">
            {sliderImages.map((_, slideIndex) => (
                <div
                    key={slideIndex}
                    onClick={() => goToSlide(slideIndex)}
                    className={`cursor-pointer ${currentIndex === slideIndex ? "text-white" : "text-gray-500"}`}
                >
                    <RxDotFilled size={25} />
                </div>
            ))}
        </div>

        <h2 className="mt-1.5 text-red-600 text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase font-bold text-center">
            {currentTitle}
        </h2>
    </div>
);

export default DotsIndicator;
