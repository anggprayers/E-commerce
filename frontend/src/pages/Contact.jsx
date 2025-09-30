import React, { useContext, useState } from "react";
import axios from "axios";
import Title from "../components/Title";
import NewsLetterBox from "../components/NewsLetterBox";
import { FaFolderOpen } from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";

const Contact = () => {
    const { backendUrl } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        email: "",
        subject: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [files, setFiles] = useState({ front: null, back: null, side: null });

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg("");
        setErrorMsg("");

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });

            // Append each file if it exists
            if (files.front) data.append("frontDesign", files.front);
            if (files.back) data.append("backDesign", files.back);
            if (files.side) data.append("sideDesign", files.side);

            const res = await axios.post(backendUrl + "/api/email/send", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.success) {
                setSuccessMsg("Email sent successfully!");
                setFormData({ name: "", contact: "", email: "", subject: "", message: "" });
                setFiles({ front: null, back: null, side: null }); // reset all 3

                setTimeout(() => setSuccessMsg(""), 5000);
            } else {
                setErrorMsg(res.data.error || "Failed to send email.");
                setTimeout(() => setErrorMsg(""), 5000);
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.error || "Something went wrong.");
            setTimeout(() => setErrorMsg(""), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="text-center text-2xl pt-10 border-t border-white">
                <Title text1={"CONTACT"} text2={"US"} />
            </div>

            {/* Map + Store Info */}
            <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
                <div className="w-full md:max-w-[480px]">
                    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.6062108258675!2d121.05049287545889!3d14.621494635867405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b7bf0b14e91f%3A0x3afae5e3d0ba6969!2sRegus%20-%20Manila%2C%20Gateway%20Tower%20-%20Quezon%20City!5e0!3m2!1sen!2sph!4v1757874272152!5m2!1sen!2sph"
                            className="absolute top-0 left-0 w-full h-full"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>

                <div className="flex flex-col justify-center items-start gap-6">
                    <p className="font-semibold text-xl text-white">Our Store</p>
                    <p className="text-white/80">
                        5th Floor Gateway Tower, <br /> Gen. Roxas Avenue Corner, <br />
                        Gen Aguinaldo Socorro, <br />
                        Araneta Center, Cubao,
                        <br /> 1109 Quezon City
                    </p>
                    <p className="text-white/80">
                        Tel: +63 961 642 7818 <br /> Email: kukzsportswear@gmail.com
                    </p>
                </div>
            </div>

            {/* Contact Form */}
            <div className="flex justify-center mb-28 text-white">
                <form id="contact-form" className="flex flex-col w-full md:w-1/2 gap-4 p-6" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-white text-center">Get in touch</h2>
                        <hr className="border-t-2 border-red-500 mt-2 w-20 mx-auto" />
                    </div>

                    {successMsg && <p className="text-green-500 text-center">{successMsg}</p>}
                    {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none placeholder-gray-500"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="tel"
                        name="contact"
                        placeholder="+639XXXXXXXXX"
                        pattern="^\+639\d{9}$"
                        maxLength="13"
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none placeholder-gray-500"
                        value={formData.contact}
                        onChange={handleChange}
                        onInput={(e) => {
                            let value = e.target.value;
                            if (!value.startsWith("+639")) {
                                value = "+639";
                            }
                            value = value.replace(/(?!^\+)\D/g, "");
                            if (value.length > 13) {
                                value = value.slice(0, 13);
                            }
                            e.target.value = value;
                        }}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none placeholder-gray-500"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none placeholder-gray-500"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        rows="5"
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none placeholder-gray-500"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />

                    {/* File Uploads */}
                    <div className="flex flex-col gap-4">
                        <label className="text-sm font-medium text-white">Upload Your Designs (Optional)</label>

                        {/* Front Design */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="frontDesign"
                                className="cursor-pointer flex items-center justify-start gap-2 px-4 py-2 
                text-white/80 border border-white/30 rounded-lg 
                hover:bg-red-500 hover:border-red-500 transition duration-200"
                            >
                                <FaFolderOpen className="text-lg text-amber-500" />
                                Front Design
                            </label>
                            <input
                                id="frontDesign"
                                type="file"
                                name="frontDesign"
                                accept="image/*"
                                onChange={(e) => setFiles((prev) => ({ ...prev, front: e.target.files[0] }))}
                                className="hidden"
                            />
                            {files.front && (
                                <p className="text-sm text-gray-400 mt-1">
                                    Selected: <span className="text-white">{files.front.name}</span>
                                </p>
                            )}
                        </div>

                        {/* Back Design */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="backDesign"
                                className="cursor-pointer flex items-center justify-start gap-2 px-4 py-2 
                text-white/80 border border-white/30 rounded-lg 
                hover:bg-red-500 hover:border-red-500 transition duration-200"
                            >
                                <FaFolderOpen className="text-lg text-amber-500" />
                                Upper Back Design
                            </label>
                            <input
                                id="backDesign"
                                type="file"
                                name="backDesign"
                                accept="image/*"
                                onChange={(e) => setFiles((prev) => ({ ...prev, back: e.target.files[0] }))}
                                className="hidden"
                            />
                            {files.back && (
                                <p className="text-sm text-gray-400 mt-1">
                                    Selected: <span className="text-white">{files.back.name}</span>
                                </p>
                            )}
                        </div>

                        {/* Side Design */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="sideDesign"
                                className="cursor-pointer flex items-center justify-start gap-2 px-4 py-2 
                text-white/80 border border-white/30 rounded-lg 
                hover:bg-red-500 hover:border-red-500 transition duration-200"
                            >
                                <FaFolderOpen className="text-lg text-amber-500" />
                                Side Design
                            </label>
                            <input
                                id="sideDesign"
                                type="file"
                                name="sideDesign"
                                accept="image/*"
                                onChange={(e) => setFiles((prev) => ({ ...prev, side: e.target.files[0] }))}
                                className="hidden"
                            />
                            {files.side && (
                                <p className="text-sm text-gray-400 mt-1">
                                    Selected: <span className="text-white">{files.side.name}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-red-600 font-bold w-32"
                        >
                            {loading ? "Sending..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>

            <NewsLetterBox />
        </div>
    );
};

export default Contact;
