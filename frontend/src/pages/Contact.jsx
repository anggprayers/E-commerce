import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsLetterBox from '../components/NewsLetterBox';

const Contact = () => {
    return (
        <div>
            <div className='text-center text-2xl pt-10 border-t'>
                <Title text1={'CONTACT'} text2={'US'} />
            </div>
            <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
                <img className='w-full md:max-w-[480px] ' src={assets.contact_img} alt='' />
                <div className='flex flex-col justify-center items-start gap-6'>
                    <p className='font-semibold text-xl text-gray-600'>Our Store</p>
                    <p className='text-gray-500'>
                        Merville Park Subdivision <br /> 3 Barcelona, Parañaque
                        <br /> 1709 Metro Manila
                    </p>
                    <p className='text-gray-500'>
                        Tel: +63 961 642-7818 <br /> Email: kukzsportswear@gmail.com
                    </p>
                    <p></p>
                    <p></p>
                </div>
            </div>
            {/* Contact Form Only */}
            <div className='flex justify-center mb-28'>
                <form
                    action='https://api.web3forms.com/submit'
                    method='POST'
                    className='flex flex-col w-full md:w-1/2 gap-4 p-6'
                >
                    <div className='mb-4'>
                        <h2 className='text-2xl font-bold text-gray-700 text-center'>
                            Get in touch
                        </h2>
                        <hr className='border-t-2 border-red-500 mt-2 w-20 mx-auto' />
                    </div>

                    <input
                        type='hidden'
                        name='access_key'
                        value='1410fca1-78e0-4a84-8767-158a1c6974fa'
                    />

                    <input
                        type='text'
                        name='name'
                        placeholder='Your Name'
                        className='p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none'
                        required
                    />
                    <input
                        type='tel'
                        name='contact'
                        placeholder='+639XXXXXXXXX'
                        pattern='^\+639\d{9}$'
                        maxLength='13'
                        className='p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none'
                        required
                        onInput={(e) => {
                            let value = e.target.value;

                            // Ensure it always starts with +639
                            if (!value.startsWith('+639')) {
                                value = '+639';
                            }

                            // Remove any non-numeric characters except +
                            value = value.replace(/(?!^\+)\D/g, '');

                            // Limit to +639 + 9 digits
                            if (value.length > 13) {
                                value = value.slice(0, 13);
                            }

                            e.target.value = value;
                        }}
                    />
                    <input
                        type='email'
                        name='email'
                        placeholder='Your Email'
                        className='p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none'
                        required
                    />
                    <textarea
                        name='message'
                        placeholder='Your Message'
                        rows='5'
                        className='p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none'
                        required
                    ></textarea>

                    {/* Button centered */}
                    <div className='flex justify-center'>
                        <button
                            type='submit'
                            className='flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-red-600 font-bold w-32'
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
