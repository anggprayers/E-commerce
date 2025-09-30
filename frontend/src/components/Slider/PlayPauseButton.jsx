import React from "react";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";

const PlayPauseButton = ({ isPlaying, togglePlay }) => (
    <div
        onClick={togglePlay}
        className="hidden group-hover:block absolute top-1/3 left-1/2 -translate-x-1/2 
               -translate-y-1/2 text-white text-2xl md:text-3xl rounded-full p-2 
               md:p-3 bg-black/30 cursor-pointer"
    >
        {isPlaying ? <BsPauseFill size={30} /> : <BsPlayFill size={30} />}
    </div>
);

export default PlayPauseButton;
