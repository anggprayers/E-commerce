import React, { useRef, useState } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight, BsPlayFill, BsPauseFill } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import { assets } from "../assets/assets";

const Slider = () => {
    const sliderImages = [
        { src: assets.slider_video, type: "video", title: "Beat The Odds" },
        { src: assets.slider_video2, type: "video", title: "Terrafirma on Fire" },
        { src: assets.slider_image1, type: "image", title: "Wear the Will to Win" },
    ];

    const videoRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        setCurrentIndex(isFirstSlide ? sliderImages.length - 1 : currentIndex - 1);
        setIsPlaying(true); // reset play for video
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === sliderImages.length - 1;
        setCurrentIndex(isLastSlide ? 0 : currentIndex + 1);
        setIsPlaying(true); // reset play for video
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };

    const isVideo = sliderImages[currentIndex].type === "video";
    const currentTitle = sliderImages[currentIndex].title;

    return (
        <div className="relative -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw] h-[880px] pb-20 group">
            {isVideo ? (
                <video
                    ref={videoRef}
                    src={sliderImages[currentIndex].src}
                    autoPlay
                    loop
                    muted
                    className="w-full h-[400px] sm:h-[500px] md:h-[650px] lg:h-[780px] object-cover"
                />
            ) : (
                <img
                    src={sliderImages[currentIndex].src}
                    alt="slide"
                    className="w-full h-[400px] sm:h-[500px] md:h-[650px] lg:h-[780px] object-cover"
                />
            )}

            {/* Left Arrow */}
            <div
                onClick={prevSlide}
                className="hidden group-hover:block absolute top-1/4 sm:top-1/2 md:top-1/2 lg:top-1/2 left-4 md:left-8 -translate-y-1/2 text-white text-2xl md:text-3xl rounded-full p-2 md:p-3 bg-black/30 cursor-pointer"
            >
                <BsChevronCompactLeft size={25} md={35} />
            </div>

            {/* Right Arrow */}
            <div
                onClick={nextSlide}
                className="hidden group-hover:block absolute top-1/4 sm:top-1/2 md:top-1/2 lg:top-1/2 right-4 md:right-8 -translate-y-1/2 text-white text-2xl md:text-3xl rounded-full p-2 md:p-3 bg-black/30 cursor-pointer"
            >
                <BsChevronCompactRight size={25} md={35} />
            </div>

            {/* Play/Pause Button */}
            {isVideo && (
                <div
                    onClick={togglePlay}
                    className="hidden group-hover:block absolute top-1/4 sm:top-1/2 md:top-1/2 lg:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl md:text-3xl rounded-full p-2 md:p-3 bg-black/30 cursor-pointer"
                >
                    {isPlaying ? <BsPauseFill size={25} md={35} /> : <BsPlayFill size={25} md={35} />}
                </div>
            )}

            {/* Dots + Overlay Text */}
            <div className="relative flex flex-col items-center justify-center py-2">
                {/* Dots */}
                <div className="flex space-x-2">
                    {sliderImages.map((_, slideIndex) => (
                        <div
                            key={slideIndex}
                            onClick={() => goToSlide(slideIndex)}
                            className={`cursor-pointer ${currentIndex === slideIndex ? "text-white" : "text-gray-500"}`}
                        >
                            <RxDotFilled size={25} />
                        </div>
                    ))}
                </div>

                {/* Overlay Text below dots */}
                <h2 className="mt-2 text-red-700 text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase font-bold drop-shadow-lg text-center">
                    {currentTitle}
                </h2>
            </div>
        </div>
    );
};

export default Slider;
