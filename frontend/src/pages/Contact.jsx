import React from "react";
import Title from "../components/Title";
import NewsLetterBox from "../components/NewsLetterBox";

const Contact = () => {
    return (
        <div>
            <div className="text-center text-2xl pt-10 border-t border-white">
                <Title text1={"CONTACT"} text2={"US"} />
            </div>
            <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
                {/* Replaced image with Google Maps iframe */}
                <div className="w-full md:max-w-[480px]">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3862.7632267161653!2d121.01896967447541!3d14.498277285976046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397cf9570d2d279%3A0x9ed68f0339cae627!2sKukz%20Sportswear!5e0!3m2!1sen!2sph!4v1757606009369!5m2!1sen!2sph"
                        width="500"
                        height="450"
                        style={{ border: 0 }} // 👈 fixed here
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>

                <div className="flex flex-col justify-center items-start gap-6">
                    <p className="font-semibold text-xl text-white">Our Store</p>
                    <p className="text-white/80">
                        Merville Park Subdivision <br /> 3 Barcelona, Parañaque
                        <br /> 1709 Metro Manila
                    </p>
                    <p className="text-white/80">
                        Tel: +63 961 642 7818 <br /> Email: kukzsportswear@gmail.com
                    </p>
                </div>
            </div>

            {/* Contact Form Only */}
            <div className="flex justify-center mb-28 text-white">
                <form
                    action="https://api.web3forms.com/submit"
                    method="POST"
                    className="flex flex-col w-full md:w-1/2 gap-4 p-6"
                >
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-white text-center">Get in touch</h2>
                        <hr className="border-t-2 border-red-500 mt-2 w-20 mx-auto" />
                    </div>

                    <input type="hidden" name="access_key" value="1410fca1-78e0-4a84-8767-158a1c6974fa" />

                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none placeholder-gray-500"
                        required
                    />
                    <input
                        type="tel"
                        name="contact"
                        placeholder="+639XXXXXXXXX"
                        pattern="^\+639\d{9}$"
                        maxLength="13"
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none placeholder-gray-500"
                        required
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
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none placeholder-gray-500"
                        required
                    />
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        rows="5"
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none placeholder-gray-500"
                        required
                    ></textarea>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-red-600 font-bold w-32"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>

            <NewsLetterBox />
        </div>
    );
};

export default Contact;
