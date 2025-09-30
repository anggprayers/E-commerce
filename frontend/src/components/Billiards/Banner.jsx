import React from "react";
import CloudinaryImage from "../CloudinaryImage";

const Banner = ({ baseImg }) => (
    <div className="relative w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[285px] border-t border-white overflow-hidden">
        <CloudinaryImage
            baseUrl={baseImg}
            alt="Billiards Banner"
            widths={[768, 1280, 1920]}
            desiredHeight={700}
            className="w-full h-full object-cover object-top"
            loading="eager"
            fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-start px-6 sm:px-12">
            <h1 className="text-white font-extrabold tracking-wide text-4xl sm:text-5xl md:text-6xl leading-none">
                BILLIARDS
            </h1>
        </div>
    </div>
);

export default Banner;
