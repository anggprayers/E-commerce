import React from "react";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsLetterBox from "../components/NewsLetterBox";
import Slider from "../components/Slider";
import Category from "../components/Category";

const Home = () => {
    return (
        <div>
            <Slider />
            <Category />
            <LatestCollection />
            <BestSeller />
            <OurPolicy />
            <NewsLetterBox />
        </div>
    );
};

export default Home;
