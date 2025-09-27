import React from "react";
import { assets } from "../assets/assets";

const PageLoader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
            <div className="relative flex flex-col items-center">
                <img src={assets.logo1} alt="Logo" className="w-20 h-20 mb-4 animate-bounce" />
            </div>
        </div>
    );
};

export default PageLoader;
