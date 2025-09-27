import React from "react";
import { Link } from "react-router-dom";
import { BsChevronRight } from "react-icons/bs";

const TopBanner = () => {
    return (
        <div className="w-ful">
            <div className="max-w-7xl mx-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-white">
                <span className="mr-1">For customized jersey,</span>
                <Link to="/customize-jersey" className="flex items-center text-red-600 font-semibold hover:underline">
                    Talk to us <BsChevronRight className="ml-1" />
                </Link>
            </div>
        </div>
    );
};

export default TopBanner;
