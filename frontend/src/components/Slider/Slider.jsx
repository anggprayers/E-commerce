import React, { useEffect, useRef, useState } from "react";
import { assets } from "../../assets/assets";
import SlideContent from "./SlideContent";
import NavigationArrows from "./NavigationArrows";
import PlayPauseButton from "./PlayPauseButton";
import DotsIndicator from "./DotsIndicator";

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

    const isVideo = sliderImages[currentIndex].type === "video";
    const currentTitle = sliderImages[currentIndex].title;

    // Auto play/pause logic
    useEffect(() => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        video.pause();

        if (isVideo && isPlaying && !isHovered) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    if (err.name !== "AbortError") console.warn("Video play error:", err.name);
                });
            }
        }
    }, [isHovered, isPlaying, currentIndex, isVideo]);

    // Navigation
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
        if (isPlaying) videoRef.current.pause();
        else videoRef.current.play().catch(() => {});
        setIsPlaying(!isPlaying);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
        setIsPlaying(true);
    };

    // Swipe navigation (mobile)
    useEffect(() => {
        let startX = 0,
            endX = 0;

        const handleTouchStart = (e) => (startX = e.touches[0].clientX);
        const handleTouchEnd = (e) => {
            endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) nextSlide();
            else if (endX - startX > 50) prevSlide();
        };

        const slider = sliderRef.current;
        if (slider) {
            slider.addEventListener("touchstart", handleTouchStart, { passive: true });
            slider.addEventListener("touchend", handleTouchEnd, { passive: true });
        }

        return () => {
            if (slider) {
                slider.removeEventListener("touchstart", handleTouchStart);
                slider.removeEventListener("touchend", handleTouchEnd);
            }
        };
    }, []);

    return (
        <div
            ref={sliderRef}
            className="relative -mx-3 sm:-mx-[4vw] md:-mx-[6vw] lg:-mx-[8vw] pb-20 group overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
                if (window.innerWidth < 768) setIsHovered((prev) => !prev);
            }}
        >
            {/* Slide Content */}
            <SlideContent isVideo={isVideo} videoRef={videoRef} src={sliderImages[currentIndex].src} />

            {/* Navigation */}
            <NavigationArrows prevSlide={prevSlide} nextSlide={nextSlide} />

            {/* Play/Pause */}
            {isVideo && <PlayPauseButton isPlaying={isPlaying} togglePlay={togglePlay} />}

            {/* Dots + Title */}
            <DotsIndicator
                currentIndex={currentIndex}
                sliderImages={sliderImages}
                goToSlide={goToSlide}
                currentTitle={currentTitle}
            />
        </div>
    );
};

export default Slider;
