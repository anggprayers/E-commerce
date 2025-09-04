import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Verify = () => {
    const [status, setStatus] = useState('Checking payment...');
    const [loading, setLoading] = useState(true);
    const { backendUrl, setCartItems } = useContext(ShopContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const intentId = params.get('payment_intent_id');

                if (!intentId) {
                    setStatus('Missing payment_intent_id');
                    setLoading(false);
                    return;
                }

                // Call backend to verify payment
                const { data } = await axios.post(`${backendUrl}/api/order/verify`, {
                    payment_intent_id: intentId,
                });

                if (data.success && data.paid) {
                    // Clear cart locally
                    setCartItems({});
                    localStorage.removeItem('cartItems');

                    setStatus('Payment Successful! Redirecting...');
                    setTimeout(() => navigate('/orders', { state: { refresh: true } }), 2000);
                } else if (data.success && !data.paid) {
                    setStatus('Payment Pending / Failed. Please try again.');
                } else {
                    setStatus('Verification failed: ' + (data.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Verify Payment Error:', error);
                setStatus('Error verifying payment. Try refreshing the page.');
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [backendUrl, location.search, navigate, setCartItems]);

    return (
        <div className='flex flex-col items-center justify-center h-screen text-center px-4'>
            <h1 className='text-2xl font-bold mb-4'>Payment Verification</h1>
            <p className='text-lg mb-6'>{loading ? 'Please wait...' : status}</p>
            {!loading && status !== 'Payment Successful! Redirecting...' && (
                <button
                    onClick={() => navigate('/orders', { state: { refresh: true } })}
                    className='px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition'
                >
                    Proceed to Orders
                </button>
            )}
        </div>
    );
};

export default Verify;
