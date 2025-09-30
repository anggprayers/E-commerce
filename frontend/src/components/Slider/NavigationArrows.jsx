import React from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";

const NavigationArrows = ({ prevSlide, nextSlide }) => (
    <>
        <div
            onClick={prevSlide}
            className="hidden group-hover:block absolute top-1/3 left-4 md:left-8 -translate-y-1/2 
                 text-white text-2xl md:text-3xl rounded-full p-2 md:p-3 bg-black/30 cursor-pointer"
        >
            <BsChevronCompactLeft size={30} />
        </div>

        <div
            onClick={nextSlide}
            className="hidden group-hover:block absolute top-1/3 right-4 md:right-8 -translate-y-1/2 
                 text-white text-2xl md:text-3xl rounded-full p-2 md:p-3 bg-black/30 cursor-pointer"
        >
            <BsChevronCompactRight size={30} />
        </div>
    </>
);

export default NavigationArrows;
