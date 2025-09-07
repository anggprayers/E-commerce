import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                <div>
                    <img src={assets.logo1} className='mb-5 w-32' alt='' />
                    <p className='w-full md:w-2/3 text-white'>
                        We deliver innovative upscale and customize, athletic and lifestyle apparel
                        solutions.
                    </p>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5 text-white'>Kukz Sportswear</p>
                    <ul className='flex flex-col gap-1 text-white/80'>
                        <li>
                            <Link to='/'>Home</Link>
                        </li>
                        <li>
                            <Link to='/about'>About Us</Link>
                        </li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5 text-white'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-1 text-white/80'>
                        <li>+639567991569</li>
                        <li>kukzsportswear@gmail.com</li>
                    </ul>
                </div>
            </div>
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>
                    Copyright 2025@ kukzsportswear.com - All Rights Reserved{' '}
                </p>
            </div>
        </div>
    );
};

export default Footer;
