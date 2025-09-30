import React from "react";
import { Link } from "react-router-dom";
import { BsChevronRight, BsTelephoneFill, BsEnvelopeFill } from "react-icons/bs";

const TopBanner = () => {
    return (
        <div className="w-full">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between py-2 px-4 text-sm font-medium text-white gap-2 md:gap-0 min-h-[40px]">
                {/* Left - Contact Info */}
                <div className="flex items-center gap-6 whitespace-nowrap">
                    <p className="flex items-center gap-2 hover:text-red-500 transition">
                        <BsTelephoneFill className="text-red-500" /> 09616427818
                    </p>
                    <p className="flex items-center gap-2 hover:text-red-500 transition">
                        <BsEnvelopeFill className="text-red-500" /> kukzsportswear@gmail.com
                    </p>
                </div>

                {/* Center - Jersey CTA */}
                <div className="flex items-center justify-center whitespace-nowrap">
                    <span className="mr-1">For customized jersey,</span>
                    <Link
                        to="/contact#contact-form"
                        className="flex items-center text-red-600 font-semibold hover:underline"
                    >
                        Talk to us <BsChevronRight className="ml-1 w-4 h-4 shrink-0" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TopBanner;
