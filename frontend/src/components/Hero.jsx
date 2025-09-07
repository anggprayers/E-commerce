import React from 'react';
import { assets } from '../assets/assets';

const Hero = () => {
    return (
        <div className='w-full'>
            <img
                className='w-full  h-[70vh] sm:h-[80vh] lg:h-[85vh] object-contain'
                src={assets.hero}
                alt=''
            />
        </div>
    );
};

export default Hero;
