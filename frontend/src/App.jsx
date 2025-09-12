import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer, toast } from "react-toastify";
import Verify from "./pages/Verify";
import ScrollToTop from "./components/ScrollToTop";
import Billiards from "./pages/Billiards";
import Basketball from "./pages/Basketball";
import Volleyball from "./pages/Volleyball";
import Activewear from "./pages/Activewear";
import Football from "./pages/Football";
import Soccer from "./pages/Soccer";
import Corporate from "./pages/Corporate";

const App = () => {
    return (
        <div className="px-4 sm:px-[5vw] md:px-[7vw] 1g:px-[9vw]">
            <ToastContainer />
            <Navbar />
            <SearchBar />
            <ScrollToTop />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/product/:productId" element={<Product />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/place-order" element={<PlaceOrder />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/billiards" element={<Billiards />} />
                <Route path="/mens-basketball" element={<Basketball />} />
                <Route path="/volleyball" element={<Volleyball />} />
                <Route path="/activewear" element={<Activewear />} />
                <Route path="/football" element={<Football />} />
                <Route path="/soccer" element={<Soccer />} />
                <Route path="/corporate" element={<Corporate />} />
            </Routes>
            <Footer />
        </div>
    );
};

export default App;
