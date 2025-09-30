import React from "react";
import { cloudinaryUrl } from "../utils/cloudinaryUrl";

const CloudinaryImage = ({
    baseUrl,
    alt,
    widths = [768, 1280, 1920],
    desiredHeight = 700, // default to 700px container height
    multiplier = 3, // extra pixels for retina sharpness
    className = "",
    loading = "lazy",
    fetchPriority,
}) => {
    // Always fetch based on desiredHeight × multiplier
    const fetchHeight = desiredHeight * multiplier;

    const srcSet = widths.map((w) => `${cloudinaryUrl(baseUrl, { w, h: fetchHeight })} ${w}w`).join(", ");

    return (
        <img
            src={cloudinaryUrl(baseUrl, { w: widths[0], h: fetchHeight })}
            srcSet={srcSet}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1920px"
            alt={alt}
            width={widths[widths.length - 1]}
            height={fetchHeight}
            className={className}
            loading={loading}
            fetchPriority={fetchPriority}
        />
    );
};

export default CloudinaryImage;
