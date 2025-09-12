import React from "react";

const NewsLetterBox = () => {
    const onSubmitHandler = (event) => {
        event.preventDefault();
    };
    return (
        <div className="text-center">
            <p className="text-lg font-medium text-white">Subscribe for updates on new drops & exclusive deals</p>
            <form
                onSubmit={onSubmitHandler}
                className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-2 border border-gray-600 pl-3 rounded-md"
            >
                <input
                    type="email"
                    className="w-full sm:flex-1 outline-none bg-transparent text-white placeholder-gray-400"
                    placeholder="Enter your email"
                    required
                />
                <button
                    type="submit"
                    className="bg-white text-black text-sm px-6 py-2 font-semibold active:bg-red-700 transition hover:bg-red-700"
                >
                    SUBSCRIBE
                </button>
            </form>
        </div>
    );
};

export default NewsLetterBox;
