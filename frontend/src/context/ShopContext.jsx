import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = "₱";
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const navigate = useNavigate();

    const addToCart = async (itemId, size, frontName = "", backName = "", jerseyNumber = "") => {
        if (!size) {
            toast.error("Please select size");
            return;
        }

        setCartItems((prev) => {
            const newCart = { ...prev };

            if (!newCart[itemId]) {
                newCart[itemId] = {};
            }

            if (!newCart[itemId][size]) {
                newCart[itemId][size] = {
                    quantity: 0,
                    frontName,
                    backName,
                    jerseyNumber,
                };
            }

            newCart[itemId][size].quantity += 1;

            // overwrite names if provided
            if (frontName) newCart[itemId][size].frontName = frontName;
            if (backName) newCart[itemId][size].backName = backName;
            if (jerseyNumber) newCart[itemId][size].jerseyNumber = jerseyNumber;

            return newCart;
        });

        // toast popup
        toast.success("Added to cart! Click here to view.", {
            onClick: () => navigate("/cart"),
            closeOnClick: true,
            autoClose: 5000,
        });

        // sync with backend if logged in
        if (token) {
            try {
                await axios.post(
                    backendUrl + "/api/cart/add",
                    { itemId, size, frontName, backName, jerseyNumber },
                    { headers: { token } }
                );
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                const entry = cartItems[items][item];
                if (entry && entry.quantity > 0) {
                    totalCount += entry.quantity;
                }
            }
        }
        return totalCount;
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            const itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                const entry = cartItems[items][item];
                if (entry && entry.quantity > 0 && itemInfo) {
                    totalAmount += itemInfo.price * entry.quantity;
                }
            }
        }
        return totalAmount;
    };

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId] && cartData[itemId][size]) {
            if (quantity <= 0) {
                delete cartData[itemId][size];
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            } else {
                cartData[itemId][size].quantity = quantity;
            }
        }

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + "/api/cart/update", { itemId, size, quantity }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/product/list");
            if (response.data) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + "/api/cart/get", {}, { headers: { token } });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        if (!token && localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
        }
    }, []);

    // Fetch cart whenever token changes
    useEffect(() => {
        if (token) {
            getUserCart(token);
        } else {
            setCartItems({});
        }
    }, [token]);

    const value = {
        products,
        currency,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        token,
        setToken,
    };

    return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
