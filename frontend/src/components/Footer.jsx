import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
    useEffect(() => {
        console.log("%cDeveloped by Angg", "color: violet; font-size: 8px; font-weight: bold;");
    }, []);

    return (
        <footer className="bg-black text-white mt-20">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                {/* Logo + About */}
                <div>
                    <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        <img
                            src={assets.logo1}
                            alt="Kukz Logo"
                            width={140}
                            height={50}
                            className="mb-4 object-contain"
                        />
                    </Link>
                    <p className="text-white/80 text-sm leading-relaxed max-w-xs sm:max-w-sm">
                        We deliver innovative, upscale, and customized athletic and lifestyle apparel solutions.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                    <ul className="flex flex-col gap-2 text-white/80 text-sm">
                        <li>
                            <Link
                                to="/"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                className="hover:underline"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:underline">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link to="/privacy" className="hover:underline">
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link to="/terms" className="hover:underline">
                                Terms & Conditions
                            </Link>
                        </li>
                        <li className="italic text-xs text-red-500">We do not sell your data</li>
                    </ul>
                </div>

                {/* Products */}
                <div>
                    <h4 className="text-lg font-semibold mb-4">Products</h4>
                    <ul className="flex flex-col gap-2 text-white/80 text-sm">
                        {[
                            "Jersey Set",
                            "Tops & T-shirts",
                            "Shorts",
                            "Pants & Leggings",
                            "Hoodies",
                            "Jackets",
                            "P.E. Uniform",
                        ].map((cat) => (
                            <li key={cat}>
                                <Link
                                    to={`/collection?category=${encodeURIComponent(cat)}`}
                                    className="hover:underline"
                                >
                                    {cat}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Customer Care */}
                <div>
                    <h4 className="text-lg font-semibold mb-4">Customer Care</h4>
                    <ul className="flex flex-col gap-2 text-white/80 text-sm">
                        <li>
                            <Link to="/help" className="hover:underline">
                                Help Center
                            </Link>
                        </li>
                        <li>
                            <Link to="/returns" className="hover:underline">
                                Returns
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:underline">
                                Contact Us
                            </Link>
                        </li>
                    </ul>

                    {/* Social Icons */}
                    <div className="flex gap-5 mt-6">
                        <a
                            href="https://www.facebook.com/kukzsports/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-500"
                        >
                            <FaFacebookF size={18} className="w-[18px] h-[18px]" />
                        </a>
                        <a
                            href="https://www.instagram.com/kukzsports/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-pink-500"
                        >
                            <FaInstagram size={18} className="w-[18px] h-[18px]" />
                        </a>
                        <a
                            href="https://www.tiktok.com/@kukzsports"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-400"
                        >
                            <FaTiktok size={18} className="w-[18px] h-[18px]" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/20 mt-8">
                <p className="text-center py-4 text-sm text-white/60">
                    © 2025{" "}
                    <a href="https://kukzsportswear.com/" className="hover:underline">
                        Kukz Sportswear
                    </a>
                    . All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
