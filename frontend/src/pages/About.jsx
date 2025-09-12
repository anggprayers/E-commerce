import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";

const About = () => {
    return (
        <div>
            <div className="text-2xl text-center pt-8 border-t border-white">
                <Title text1={"ABOUT"} text2={"US"} />
            </div>
            <div className="my-10 flex flex-col md:flex-row gap-16">
                <img className="w-full md:max-w-[450px]" src={assets.about_logo} alt="" />
                <div className="flex flex-col justify-center gap-6 md:w-2/4 text-white">
                    <p>
                        The <span className="text-medium text-red-600 leading-relaxed">KUKZ SPORTSWEAR</span> logo
                        symbolizes excellence, innovation, unity. Featuring a bold{" "}
                        <span className="text-medium">"K"</span> with a <span className="uppercase">crown</span>, it
                        reflects the brand's commitment to empowering athletes with eco-friendly, customized sportswear
                        that combines performance, comfort, and sustainability
                    </p>
                    <p className="italic">Confidence never goes out of style.</p>
                    <b className="text-red-600 text-lg -mb-4">Our Mission</b>
                    <p>
                        Kukz Sportswear strives to combine performance, style, and community to create products that
                        meet the needs of athletes while inspiring and empowering individuals to embrace an active
                        lifestyle. Guided by our tagline,{" "}
                        <span className="font-semibold text-red-600">Beat the Odds</span>, we aim to motivate everyone
                        to push boundaries and achieve greatness, both on and off the field.
                    </p>
                </div>
            </div>
            <div className="text-xl py-4">
                <Title text1={"WHY"} text2={"CHOOSE US"} />
            </div>
            <div className="flex flex-col md:flex-row text-sm mb-0 text-white">
                <div className="flex-1 border px-6 md:px-10 py-8 sm:py-16 flex flex-col gap-5">
                    <b className="text-red-600 text-lg">Why do we exists?</b>
                    <p className="text-white/90">
                        Kukz Sportswear exists to meet the specific needs of athletes and fitness enthusiasts by
                        providing high-quality apparel that supports performance, comfort, and styles.
                    </p>
                </div>
                <div className="flex-1 border px-6 md:px-10 py-8 sm:py-16 flex flex-col gap-5">
                    <b className="text-red-600 text-lg">What sets as apart?</b>
                    <p className="text-white/90">
                        Kukz Sportswear sets itself apart by blending innovation, style, sustainability, and community
                        engagement, creating a brand that appeals to athletes and everyday fitness enthusiasts alike.
                    </p>
                </div>
                <div className="flex-1 border px-6 md:px-10 py-8 sm:py-16 flex flex-col gap-5">
                    <b className="text-red-600 text-lg">Who do we serve?</b>
                    <p className="text-white/90">
                        Kukz Sportswear caters to athletes, fitness enthusiasts, and active lifestyle individuals with a
                        focus on performance, comfort, and lifestyle for a broad range of consumers interested in
                        maintaining or improving their physical well-being.
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row text-sm mb-20 text-white">
                <div className="flex-1 border px-6 md:px-10 py-8 sm:py-16 flex flex-col gap-5">
                    <b className="text-red-600 text-lg">How do we lead?</b>
                    <p className="text-white/90">
                        Kukz Sportswear leads by innovating in design, offering high quality and stylish products,
                        engaging with the fitness community, embracing sustainability, and staying adaptable to consumer
                        needs and trends.
                    </p>
                </div>
                <div className="flex-1 border px-6 md:px-10 py-8 sm:py-16 flex flex-col gap-5">
                    <b className="text-red-600 text-lg">What do we stand for?</b>
                    <p className="text-white/90">
                        Kukz Sportswear stands for performance, style, empowerment and innovation, with focus on
                        supporting an active, healthy lifestyle. These values guide everything we do.
                    </p>
                </div>
                <div className="flex-1 border px-6 md:px-10 py-8 sm:py-16 flex flex-col gap-5">
                    <b className="text-red-600 text-lg">Where are we headed?</b>
                    <p className="text-white/90">
                        Kukz Sportswear is heading towards growth by focusing on sustainability, innovation, market
                        expansion, and deeper consumer engagement, while positioning itself as a versatile brand for
                        athletes and fashion-conscious individuals alike.
                    </p>
                </div>
            </div>

            <div className="text-center mb-20">
                <img
                    src={assets.kukz_boss}
                    alt="Owner"
                    className="mx-auto rounded-lg shadow-lg w-full sm:w-[350px] md:w-[400px] object-cover"
                />
                <h3 className="mt-4 text-white font-bold text-xl">Daniel Martinez</h3>
                <p className="text-red-600 font-medium text-medium italic mb-5">Founder & CEO</p>
                <p className="text-white/80 font-medium leading-normal">
                    Driven by my lifelong passion for sports, I founded Kukz Sportswear, a brand committed to empowering
                    athletes to "Beat the Odds". We deliver innovative upscale and customize, athletic, and lifestyle
                    apparel solutions. Our customization and sublimation services cater to all gender athletes, and
                    active individuals, fostering performance, comfort, and sustainability.
                </p>
            </div>
            <NewsLetterBox />
        </div>
    );
};

export default About;
