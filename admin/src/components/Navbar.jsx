import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const Navbar = ({ setToken }) => {
    return (
        <div className='flex items-center py-2 px-[4%] justify-between bg-white shadow-md'>
            <div className='flex items-center gap-3'>
                <Link to='/'>
                    <img src={assets.logo1} className='w-20' alt='Kukz Logo' />
                </Link>
                <span className='text-lg sm:text-xl font-semibold text-gray-700'>Admin Panel</span>
            </div>

            <button
                onClick={() => setToken('')}
                className='bg-gray-700 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-gray-800 transition cursor-pointer'
            >
                Logout
            </button>
        </div>
    );
};

export default Navbar;
