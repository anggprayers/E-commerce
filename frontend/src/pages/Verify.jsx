import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Verify = () => {
    const [status, setStatus] = useState('Checking payment...');
    const [loading, setLoading] = useState(true);
    const { backendUrl, token, setCartItems } = useContext(ShopContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                // extract payment_intent_id from query string
                const params = new URLSearchParams(location.search);
                const intentId = params.get('payment_intent_id');

                if (!intentId) {
                    setStatus('Missing payment_intent_id');
                    setLoading(false);
                    return;
                }

                const { data } = await axios.post(
                    backendUrl + '/api/order/verify',
                    {
                        payment_intent_id: intentId,
                    },
                    { headers: { token } }
                );

                if (data.success && data.paid) {
                    // clear cart if payment successful
                    setCartItems({});
                    localStorage.removeItem('cartItems');

                    try {
                        await axios.post(
                            backendUrl + '/api/cart/clear',
                            {},
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                    } catch (error) {
                        console.error('Failed to clear backend cart:', error);
                    }

                    setStatus('Payment Successful');
                } else if (data.success && !data.paid) {
                    setStatus('Payment Pending / Failed');
                } else {
                    setStatus('Verification failed: ' + (data.message || 'Unknown error'));
                }
            } catch (error) {
                console.error(error);
                setStatus('Error verifying payment');
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [backendUrl, token, location.search, setCartItems]);

    return (
        <div className='flex flex-col items-center justify-center h-screen text-center'>
            <h1 className='text-2xl font-bold mb-4'>Payment Verification</h1>
            <p className='text-lg mb-6'>{loading ? 'Please wait...' : status}</p>

            {!loading && (
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
