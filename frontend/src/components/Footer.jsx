import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
    return (
        <div>
            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
                <div>
                    <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        <img src={assets.logo1} className="mb-5 w-32" alt="" />
                    </Link>
                    <p className="w-full md:w-2/3 text-white">
                        We deliver innovative upscale and customize, athletic and lifestyle apparel solutions.
                    </p>
                </div>
                <div>
                    <p className="text-xl font-medium mb-5 text-white">Kukz Sportswear</p>
                    <ul className="flex flex-col gap-1 text-white/80">
                        <li>
                            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/about">About Us</Link>
                        </li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                <div>
                    <p className="text-xl font-medium mb-5 text-white">GET IN TOUCH</p>
                    <ul className="flex flex-col gap-1 text-white/80">
                        <li>+63 961 642 7818</li>
                        <li>kukzsportswear@gmail.com</li>
                    </ul>
                </div>
            </div>

            {/* Social Media Section */}
            <div className="flex justify-center gap-6 my-6">
                <a
                    href="https://www.facebook.com/kukzsports/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-500 text-xl hover:opacity-80"
                >
                    <FaFacebookF />
                </a>
                <a
                    href="https://www.instagram.com/kukzsports/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-red-500 text-xl"
                >
                    <FaInstagram />{" "}
                </a>
                <a
                    href="https://www.tiktok.com/@kukzsports"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-500 text-xl hover:opacity-80"
                >
                    <FaTiktok />
                </a>
            </div>

            <div>
                <hr className="border-white" />
                <p className="py-5 text-sm text-center text-white">
                    Copyright 2025 @ kukzsportswear.com - All Rights Reserved
                </p>
            </div>
        </div>
    );
};

export default Footer;
