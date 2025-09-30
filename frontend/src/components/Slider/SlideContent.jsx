import React from "react";

const SlideContent = ({ isVideo, videoRef, src }) => {
    return (
        <div className="w-full max-h-[720px] sm:max-h-[670px] md:max-h-[620px] lg:max-h-[570px] overflow-hidden">
            {isVideo ? (
                <video
                    ref={videoRef}
                    src={src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-contain"
                />
            ) : (
                <img src={src} alt="slide" loading="lazy" className="w-full h-full object-contain" />
            )}
        </div>
    );
};

export default SlideContent;
