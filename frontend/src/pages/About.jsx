import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsLetterBox from '../components/NewsLetterBox';

const About = () => {
    return (
        <div>
            <div className='text-2xl text-center pt-8 border-t'>
                <Title text1={'ABOUT'} text2={'US'} />
            </div>
            <div className='my-10 flex flex-col md:flex-row gap-16'>
                <img className='w-full md:max-w-[450px]' src={assets.about_img} alt='' />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
                    <p>
                        Kukz Sportswear delivers innovative athletic and lifestyle apparel
                        solutions. Our customization and sublimation service caters to all genders
                        of athletes, fostering performance, comfort, and sustainability.
                    </p>
                    <p>Confidence never goes out of style.</p>
                    <b className='text-gray-800'>Our Mission</b>
                    <p>
                        Kukz Sportswear strives to combine performance, style, and community to
                        create products that meet the needs of athletes while inspiring and
                        empowering individuals to embrace an active lifestyle. Guided by our
                        tagline,{' '}
                        <span className='font-semibold text-red-600 decoration-black decoration-2'>
                            Beat the Odds
                        </span>
                        , we aim to motivate everyone to push boundaries and achieve greatness, both
                        on and off the field.
                    </p>
                </div>
            </div>
            <div className='text-xl py-4'>
                <Title text1={'WHY'} text2={'CHOOSE US'} />
            </div>
            <div className='flex flex-col md:flex-row text-sm mb-20'>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b>Why do we exists?</b>
                    <p className='text-gray-600'>
                        Kukz Sportswear exists to meet the specific needs of athletes and fitness
                        enthusiasts by providing high-quality apparel that supports performance,
                        comfort, and styles.
                    </p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b>What sets as apart?</b>
                    <p className='text-gray-600'>
                        Kukz Sportswear sets itself apart by blending innovation, style,
                        sustainability, and community engagement, creating a brand that appeals to
                        athletes and everyday fitness enthusiasts alike.
                    </p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b>Who do we serve?</b>
                    <p className='text-gray-600'>
                        Kukz Sportswear caters to athletes, fitness enthusiasts, and active
                        lifestyle individuals with a focus on performance, comfort, and lifestyle
                        for a broad range of consumers interested in maintaining or improving their
                        physical well-being.
                    </p>
                </div>
            </div>
            <NewsLetterBox />
        </div>
    );
};

export default About;
