import React, { useState, useContext, useEffect, useMemo, lazy, Suspense } from "react";
import ProgressSteps from "../components/ProgressSteps";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

// Lazy load QR components
const UnionBankQR = lazy(() => import("../components/UnionBankQR"));
const GcashQR = lazy(() => import("../components/GcashQR"));

const PlaceOrder = () => {
    const { cartItems, setCartItems, products, currency, getCartAmount, navigate, backendUrl, token } =
        useContext(ShopContext);

    const [currentStep, setCurrentStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [receiptFile, setReceiptFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // === Cart Data ===
    const [cartData, setCartData] = useState([]);
    useEffect(() => {
        if (products.length > 0) {
            const tempData = [];
            for (const productId in cartItems) {
                for (const size in cartItems[productId]) {
                    const entry = cartItems[productId][size];
                    if (entry && entry.quantity > 0) {
                        const product = products.find((p) => p._id === productId);
                        if (product) {
                            tempData.push({
                                _id: productId,
                                size,
                                quantity: entry.quantity,
                                frontName: entry.frontName || "",
                                backName: entry.backName || "",
                                jerseyNumber: entry.jerseyNumber || "",
                                name: product.name,
                                price: product.price,
                                image: product.image[0],
                            });
                        }
                    }
                }
            }
            setCartData(tempData);
        }
    }, [cartItems, products]);

    // === Address Form ===
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        barangay: "",
        city: "",
        zipcode: "",
        country: "",
        phone: "",
    });

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // === Validation ===
    const isFormValid = () => Object.values(formData).every((val) => val.trim() !== "");

    const nextStep = () => {
        if (currentStep === 2 && !isFormValid()) {
            toast.error("Please fill up all delivery information fields.");
            return;
        }
        if (currentStep === 3 && !paymentMethod) {
            toast.error("Please select a payment method before proceeding.");
            return;
        }
        if (currentStep === 4 && !receiptFile) {
            toast.error("Please upload your payment receipt before confirming.");
            return;
        }
        setCurrentStep((s) => Math.min(s + 1, 4));
    };

    const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

    // === Handle Order Submission ===
    const handlePlaceOrder = async () => {
        if (!receiptFile) {
            toast.error("Please upload your payment receipt first.");
            return;
        }

        setUploading(true);
        try {
            const form = new FormData();
            form.append("receipt", receiptFile);
            form.append("paymentMethod", paymentMethod);
            form.append("address", JSON.stringify(formData));
            form.append("amount", getCartAmount());
            form.append("items", JSON.stringify(cartData));

            const res = await axios.post(`${backendUrl}/api/order/place`, form, {
                headers: { token },
            });

            if (res.data.success) {
                toast.success("Order placed successfully!");

                +(
                    // ✅ Clear frontend cart (state + localStorage)
                    (+setCartItems({}))
                );
                +localStorage.removeItem("cartItems");

                navigate("/orders", { state: { refresh: true } });
            } else {
                toast.error("Failed to place order. Please try again.");
            }
        } catch (err) {
            toast.error("Error placing order. Please try again later.");
        } finally {
            setUploading(false);
        }
    };

    // === Memoized Order Summary ===
    const orderSummary = useMemo(
        () => (
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {cartData.map((item, index) => {
                    const subtotal = item.price * item.quantity;
                    return (
                        <div key={index} className="flex items-start gap-4 border-b pb-4">
                            <img className="w-20 h-20 object-cover" src={item.image} alt={item.name} />
                            <div className="flex-1">
                                <p className="font-bold">{item.name}</p>
                                <p className="text-sm text-gray-300">Size: {item.size}</p>
                                <p className="text-sm">Qty: {item.quantity}</p>
                                {item.frontName && <p className="text-xs text-gray-300">Front: {item.frontName}</p>}
                                {item.backName && <p className="text-xs text-gray-300">Back: {item.backName}</p>}
                                {item.jerseyNumber && <p className="text-xs text-gray-300"># {item.jerseyNumber}</p>}
                            </div>
                            <div className="font-semibold">
                                {currency} {subtotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    );
                })}

                {/* Total */}
                <div className="text-right font-bold text-lg mt-4">
                    TOTAL: {currency} {getCartAmount().toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </div>
            </div>
        ),
        [cartData, currency, getCartAmount]
    );

    return (
        <div className="pt-10 pb-20 px-4 sm:px-8 text-white">
            <ProgressSteps currentStep={currentStep} />

            {/* Step 1 - Order Summary */}
            {currentStep === 1 && (
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    {orderSummary}
                    <div className="mt-6 flex justify-between">
                        <button onClick={() => navigate("/cart")} className="px-6 py-2 bg-gray-500 rounded">
                            Back
                        </button>
                        <button onClick={nextStep} className="px-6 py-2 bg-red-600 rounded">
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2 - Delivery Info */}
            {currentStep === 2 && (
                <div className="max-w-lg mx-auto">
                    <h2 className="text-xl font-bold mb-4">Delivery / Billing Information</h2>
                    <div className="space-y-3">
                        {Object.keys(formData).map((key) => (
                            <input
                                key={key}
                                required
                                name={key}
                                value={formData[key]}
                                onChange={onChangeHandler}
                                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                className="border rounded py-1.5 px-3.5 w-full text-white placeholder:text-gray-500"
                            />
                        ))}
                    </div>
                    <div className="mt-6 flex justify-between">
                        <button onClick={prevStep} className="px-6 py-2 bg-gray-500 rounded">
                            Back
                        </button>
                        <button onClick={nextStep} className="px-6 py-2 bg-red-600 rounded">
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3 - Payment */}
            {currentStep === 3 && (
                <div className="max-w-lg mx-auto">
                    <h2 className="text-lg font-bold mb-4">Choose Payment</h2>
                    <div className="space-y-4">
                        {/* UnionBank */}
                        <label className="flex items-center gap-3 cursor-pointer border p-3 rounded">
                            <input
                                type="radio"
                                name="payment"
                                value="UnionBank"
                                checked={paymentMethod === "UnionBank"}
                                onChange={() => setPaymentMethod("UnionBank")}
                            />
                            <div className="bg-white p-1 rounded">
                                <img src={assets.unionbank_logo} alt="UnionBank" className="w-8 h-8 object-contain" />
                            </div>
                            <span className="text-orange-500 font-medium">UnionBank (Acct: 1234 5678)</span>
                        </label>

                        {/* GCash */}
                        <label className="flex items-center gap-3 cursor-pointer border p-3 rounded">
                            <input
                                type="radio"
                                name="payment"
                                value="Gcash"
                                checked={paymentMethod === "Gcash"}
                                onChange={() => setPaymentMethod("Gcash")}
                            />
                            <div className="bg-white p-1 rounded">
                                <img src={assets.gcash_icon} alt="GCash" className="w-8 h-8 object-contain" />
                            </div>
                            <span className="text-blue-500 font-medium">GCash (0917-123-4567)</span>
                        </label>
                    </div>

                    {paymentMethod && (
                        <div className="mt-6">
                            <h3 className="font-medium mb-2">Scan QR to Pay</h3>
                            <Suspense fallback={<p className="text-gray-400 text-sm">Loading QR...</p>}>
                                {paymentMethod === "UnionBank" && <UnionBankQR />}
                                {paymentMethod === "Gcash" && <GcashQR />}
                            </Suspense>
                        </div>
                    )}

                    <div className="mt-6 flex justify-between">
                        <button onClick={prevStep} className="px-6 py-2 bg-gray-500 rounded">
                            Back
                        </button>
                        <button onClick={nextStep} disabled={!paymentMethod} className="px-6 py-2 bg-red-600 rounded">
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Step 4 - Confirm */}
            {currentStep === 4 && (
                <div className="max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Delivery Information</h2>
                        <button
                            onClick={() => setCurrentStep(2)}
                            className="text-sm text-blue-400 underline hover:text-blue-300"
                        >
                            Edit
                        </button>
                    </div>

                    <div className="bg-gray-900 p-4 rounded mb-4 text-sm space-y-1">
                        <p>
                            {formData.firstName} {formData.lastName}
                        </p>
                        <p>{formData.email}</p>
                        <p>
                            {formData.street}, {formData.barangay}, {formData.city}, {formData.zipcode},{" "}
                            {formData.country}
                        </p>
                        <p>Phone: {formData.phone}</p>
                    </div>

                    <p
                        className={`mt-3 mb-2 ${
                            paymentMethod === "UnionBank"
                                ? "text-orange-500"
                                : paymentMethod === "Gcash"
                                ? "text-blue-500"
                                : "text-gray-300"
                        }`}
                    >
                        <span className="font-semibold text-white">Payment Method:</span> {paymentMethod}
                    </p>

                    <h3 className="font-semibold mb-1">Order Summary</h3>
                    {orderSummary}

                    {/* Upload Receipt */}
                    <div className="mt-6">
                        <label className="block mb-2 font-semibold">Upload Payment Receipt</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setReceiptFile(e.target.files[0])}
                            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 
                            file:rounded file:border-0 file:text-sm file:font-semibold 
                            file:bg-red-600 file:text-white hover:file:bg-red-700"
                        />
                    </div>

                    {receiptFile && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-400 mb-1">Preview:</p>
                            <img
                                src={URL.createObjectURL(receiptFile)}
                                alt="Uploaded Receipt Preview"
                                className="w-64 h-64 object-cover rounded border"
                            />
                        </div>
                    )}

                    <div className="mt-6 flex justify-between">
                        <button onClick={prevStep} className="px-6 py-2 bg-gray-500 rounded">
                            Back
                        </button>
                        <button
                            disabled={uploading}
                            onClick={handlePlaceOrder}
                            className={`px-8 py-3 rounded text-lg font-semibold ${
                                uploading
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700 transition"
                            }`}
                        >
                            {uploading ? "Placing Order..." : "Confirm & Place Order"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaceOrder;
