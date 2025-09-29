import React from "react";
import { Link } from "react-router-dom";
import { BsChevronRight, BsTelephoneFill, BsEnvelopeFill } from "react-icons/bs";

const TopBanner = () => {
    return (
        <div className="w-full">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between py-2 px-4 text-sm font-medium text-white gap-2 md:gap-0">
                {/* Left - Contact Info */}
                <div className="flex items-center gap-6">
                    <p className="flex items-center gap-2 hover:text-red-500 transition">
                        <BsTelephoneFill className="text-red-500" /> 09616427818
                    </p>
                    <p className="flex items-center gap-2 hover:text-red-500 transition">
                        <BsEnvelopeFill className="text-red-500" /> kukzsportswear@gmail.com
                    </p>
                </div>

                {/* Center - Jersey CTA */}
                <div className="flex items-center text-center">
                    <span className="mr-1">For customized jersey,</span>
                    <Link
                        to="/customize-jersey"
                        className="flex items-center text-red-600 font-semibold hover:underline"
                    >
                        Talk to us <BsChevronRight className="ml-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TopBanner;
