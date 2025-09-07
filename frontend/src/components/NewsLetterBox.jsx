import React from 'react';

const NewsLetterBox = () => {
    const onSubmitHandler = (event) => {
        event.preventDefault();
    };
    return (
        <div className='text-center'>
            <p className='text-2xl font-medium text-white'>
                Subscribe to be the first to know about our latest drops, exclusive deals, and new
                arrivals
            </p>
            <form
                onSubmit={onSubmitHandler}
                className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border border-gray-600 pl-3 rounded-md'
            >
                <input
                    type='email'
                    className='w-full sm:flex-1 outline-none bg-transparent text-white placeholder-gray-400'
                    placeholder='Enter your email'
                    required
                />
                <button
                    type='submit'
                    className='bg-white text-black text-xs px-10 py-4 font-semibold active:bg-red-500'
                >
                    SUBSCRIBE
                </button>
            </form>
        </div>
    );
};

export default NewsLetterBox;
