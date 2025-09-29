import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import { RxDotFilled } from "react-icons/rx";
import { assets } from "../assets/assets";

const BsChevronCompactLeft = lazy(() => import("react-icons/bs").then((m) => ({ default: m.BsChevronCompactLeft })));
const BsChevronCompactRight = lazy(() => import("react-icons/bs").then((m) => ({ default: m.BsChevronCompactRight })));
const BsPlayFill = lazy(() => import("react-icons/bs").then((m) => ({ default: m.BsPlayFill })));
const BsPauseFill = lazy(() => import("react-icons/bs").then((m) => ({ default: m.BsPauseFill })));

const Slider = () => {
    const sliderImages = [
        { src: assets.slider_video, type: "video", title: "Beat The Odds" },
        { src: assets.slider_video2, type: "video", title: "Beat The Odds" },
        { src: assets.slider_image1, type: "image", title: "Beat The Odds" },
    ];

    const videoRef = useRef(null);
    const sliderRef = useRef(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    // Auto play/pause fix
    useEffect(() => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        video.pause();

        if (sliderImages[currentIndex].type === "video" && isPlaying && !isHovered) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    if (err.name !== "AbortError") console.warn("Video play error:", err.name);
                });
            }
        }
    }, [isHovered, isPlaying, currentIndex]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
        setIsPlaying(true);
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play().catch(() => {});
        }
        setIsPlaying(!isPlaying);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
        setIsPlaying(true);
    };

    const isVideo = sliderImages[currentIndex].type === "video";
    const currentTitle = sliderImages[currentIndex].title;

    // Swipe & scroll navigation
    useEffect(() => {
        let startX = 0;
        let endX = 0;

        const handleTouchStart = (e) => {
            startX = e.touches[0].clientX;
        };

        const handleTouchEnd = (e) => {
            endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) {
                nextSlide(); // swipe left
            } else if (endX - startX > 50) {
                prevSlide(); // swipe right
            }
        };

        const handleWheel = (e) => {
            if (e.deltaY > 0 || e.deltaX > 50) {
                nextSlide();
            } else if (e.deltaY < 0 || e.deltaX < -50) {
                prevSlide();
            }
        };

        const slider = sliderRef.current;
        if (slider) {
            slider.addEventListener("touchstart", handleTouchStart);
            slider.addEventListener("touchend", handleTouchEnd);
            slider.addEventListener("wheel", handleWheel, { passive: true });
        }

        return () => {
            if (slider) {
                slider.removeEventListener("touchstart", handleTouchStart);
                slider.removeEventListener("touchend", handleTouchEnd);
                slider.removeEventListener("wheel", handleWheel);
            }
        };
    }, []);

    const LazyVideo = ({ src, videoRef }) => (
        <video
            ref={videoRef}
            src={src}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-[280px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover"
        />
    );

    const LazyImage = ({ src }) => (
        <img
            src={src}
            alt="slide"
            loading="lazy"
            className="w-full h-[280px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover"
        />
    );

    return (
        <div
            ref={sliderRef}
            className="relative -mx-3 sm:-mx-[4vw] md:-mx-[6vw] lg:-mx-[8vw] pb-20 group overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
                if (window.innerWidth < 768) {
                    setIsHovered((prev) => !prev);
                }
            }}
        >
            <Suspense fallback={<div className="w-full h-[300px] bg-gray-900 animate-pulse" />}>
                {isVideo ? (
                    <LazyVideo src={sliderImages[currentIndex].src} videoRef={videoRef} />
                ) : (
                    <LazyImage src={sliderImages[currentIndex].src} />
                )}
            </Suspense>

            {/* Left Arrow */}
            <Suspense fallback={null}>
                <div
                    onClick={prevSlide}
                    className="hidden group-hover:block absolute top-1/3 left-4 md:left-8 -translate-y-1/2 text-white text-2xl md:text-3xl rounded-full p-2 md:p-3 bg-black/30 cursor-pointer"
                >
                    <BsChevronCompactLeft size={25} md={35} />
                </div>
            </Suspense>

            {/* Right Arrow */}
            <Suspense fallback={null}>
                <div
                    onClick={nextSlide}
                    className="hidden group-hover:block absolute top-1/3 right-4 md:right-8 -translate-y-1/2 text-white text-2xl md:text-3xl rounded-full p-2 md:p-3 bg-black/30 cursor-pointer"
                >
                    <BsChevronCompactRight size={25} md={35} />
                </div>
            </Suspense>

            {/* Play/Pause Button */}
            {isVideo && (
                <Suspense fallback={null}>
                    <div
                        onClick={togglePlay}
                        className="hidden group-hover:block absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl md:text-3xl rounded-full p-2 md:p-3 bg-black/30 cursor-pointer"
                    >
                        {isPlaying ? <BsPauseFill size={25} md={35} /> : <BsPlayFill size={25} md={35} />}
                    </div>
                </Suspense>
            )}

            {/* Dots + Overlay Text */}
            <div className="relative flex flex-col items-center justify-center py-2">
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

                <h2 className="mt-1.5 text-red-600 text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase font-bold text-center">
                    {currentTitle}
                </h2>
            </div>
        </div>
    );
};

export default Slider;
