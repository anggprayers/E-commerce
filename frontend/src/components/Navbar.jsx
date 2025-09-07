import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } =
        useContext(ShopContext);

    const logout = () => {
        navigate('/login'); // navigate to login page
        localStorage.removeItem('token');
        localStorage.removeItem('cartItems'); // reset cart from localStorage
        setToken(''); // reset token
        setCartItems({}); // reset cart items
    };

    const cartCount = getCartCount();

    return (
        <div className='flex items-center justify-between py-5 font-medium'>
            <Link to='/'>
                <img src={assets.logo1} className='w-15' alt='Kukz Logo' />
            </Link>

            <ul className='hidden sm:flex gap-5 text-sm text-white font-bold'>
                <NavLink to='/' className='flex flex-col items-center gap-1'>
                    <p>HOME</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gradient-to-r from-red-500 to-black hidden ' />
                </NavLink>
                <NavLink to='/collection' className='flex flex-col items-center gap-1'>
                    <p>COLLECTION</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gradient-to-r from-red-500 to-black hidden' />
                </NavLink>
                <NavLink to='/about' className='flex flex-col items-center gap-1'>
                    <p>ABOUT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gradient-to-r from-red-500 to-black hidden' />
                </NavLink>
                <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                    <p>CONTACT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gradient-to-r from-red-500 to-black hidden' />
                </NavLink>
            </ul>

            <div className='flex items-center gap-6'>
                <img
                    onClick={() => setShowSearch(true)}
                    src={assets.search_icon}
                    className='w-6 cursor-pointer'
                    alt='Search'
                />

                <div className='group relative'>
                    <img
                        onClick={() => (token ? null : navigate('/login'))}
                        src={assets.profile_icon}
                        className='w-6 cursor-pointer'
                        alt=''
                    />
                    {/* ---- Dropdown Menu ----- */}
                    {token && (
                        <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                                <p className='cursor-pointer hover:text-black'>My Profile</p>
                                <p
                                    onClick={() => navigate('/orders')}
                                    className='cursor-pointer hover:text-black'
                                >
                                    Orders
                                </p>
                                <p onClick={logout} className='cursor-pointer hover:text-black'>
                                    Logout
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <Link to='/cart' className='relative'>
                    <img
                        src={assets.cart_icon}
                        className={`w-7 h-7 object-contain ${cartCount === 0 ? 'opacity-50' : ''}`}
                        alt='Shopping Cart'
                    />
                    {cartCount > 0 && (
                        <p className='absolute right-[-4px] bottom-[-4px] w-4 text-center leading-4 bg-red-500 text-white font-bold aspect-square rounded-full text-[8px]'>
                            {cartCount}
                        </p>
                    )}
                </Link>
                <img
                    onClick={() => setVisible(true)}
                    src={assets.menu_icon}
                    className='w-6 cursor-pointer sm:hidden'
                    alt=''
                />
            </div>
            {/* Sidebar menu for small screens */}
            <div
                className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
                    visible ? 'w-full' : 'w-0'
                }`}
            >
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-1 p-3'>
                        <img
                            src={assets.dropdown_icon}
                            className='h-4 rotate-90 cursor-pointer'
                            alt=''
                        />
                        <p>Back</p>
                    </div>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>
                        Home
                    </NavLink>
                    <NavLink
                        onClick={() => setVisible(false)}
                        className='py-2 pl-6 border'
                        to='/collection'
                    >
                        Collection
                    </NavLink>
                    <NavLink
                        onClick={() => setVisible(false)}
                        className='py-2 pl-6 border'
                        to='/about'
                    >
                        About
                    </NavLink>
                    <NavLink
                        onClick={() => setVisible(false)}
                        className='py-2 pl-6 border'
                        to='/contact'
                    >
                        Contact
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
