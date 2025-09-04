import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Orders = () => {
    const { backendUrl, token, currency } = useContext(ShopContext);
    const location = useLocation();

    const [orderData, setOrderData] = useState([]);

    const loadOrderData = async () => {
        try {
            if (!token) {
                return null;
            }

            const response = await axios.post(
                backendUrl + '/api/order/userorders',
                {},
                { headers: { token } }
            );
            if (response.data.success) {
                let allOrdersItem = [];
                response.data.orders.forEach((order) => {
                    order.items.forEach((item) => {
                        item['status'] = order.status;
                        item['payment'] = order.payment;
                        item['paymentMethod'] = order.paymentMethod;
                        item['date'] = order.date;
                        allOrdersItem.push(item);
                    });
                });
                setOrderData(allOrdersItem.reverse());
            }
        } catch (error) {}
    };

    useEffect(() => {
        loadOrderData();
    }, [token]);

    // Reload when coming from Place Order (COD)
    useEffect(() => {
        if (location.state?.refresh) {
            loadOrderData();
        }
    }, [location.state]);

    return (
        <div className='border-t pt-16'>
            <div className='text-2xl'>
                <Title text1={'MY'} text2={'ORDERS'} />
            </div>
            <div>
                {orderData.map((item, index) => (
                    <div
                        key={index}
                        className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'
                    >
                        <div className='flex items-start gap-6 text-sm'>
                            <img className='w-16 sm:w-20' src={item.image[0]} alt='' />
                            <div>
                                <p className='sm:text-base font-medium'>{item.name}</p>
                                <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                                    <p>
                                        {currency}{' '}
                                        {item.price.toLocaleString('en-PH', {
                                            minimumFractionDigits: 2,
                                        })}
                                    </p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Size: {item.size}</p>
                                </div>
                                <p className='mt-1'>
                                    Date:{' '}
                                    <span className='text-gray-500'>
                                        {new Date(item.date).toLocaleString('en-PH', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        })}
                                    </span>
                                </p>
                                <p className='mt-1'>
                                    Payment:{' '}
                                    <span className='text-gray-500'>{item.paymentMethod}</span>
                                </p>
                                <p className='mt-1'>
                                    Payment Status:{' '}
                                    <span
                                        className={`${
                                            item.payment
                                                ? 'text-green-600 font-semibold'
                                                : 'text-red-600 font-semibold'
                                        }`}
                                    >
                                        {item.payment ? 'Paid' : 'Not Paid'}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className='md:w-1/2 flex justify-between'>
                            <div className='flex items-center gap-2'>
                                <p
                                    className={`min-w-2 h-2 rounded-full ${
                                        item.status === 'Delivered'
                                            ? 'bg-green-500'
                                            : item.status === 'Out for Delivery'
                                            ? 'bg-yellow-500'
                                            : 'bg-gray-400'
                                    }`}
                                />
                                <p className='text-sm md:text-base'>{item.status}</p>
                            </div>
                            <button
                                onClick={loadOrderData}
                                className='border px-4 py-2 text-sm font-medium rounded-sm'
                            >
                                Track Order
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
