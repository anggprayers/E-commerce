import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {
    const [orders, setOrders] = useState([]);

    const fetchAllOrders = async () => {
        if (!token) return;

        try {
            const response = await axios.post(
                backendUrl + '/api/order/list',
                {},
                { headers: { token } }
            );
            if (response.data.success) {
                setOrders(response.data.orders.reverse());
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const statusHandler = async (status, orderId) => {
        try {
            const response = await axios.post(
                backendUrl + '/api/order/status',
                { orderId, status },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                await fetchAllOrders();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // confirmation toast for status change
    const confirmStatusChange = (newStatus, orderId) => {
        toast(
            ({ closeToast }) => (
                <div className='flex flex-col gap-2'>
                    <p>
                        Change status to <b>{newStatus}</b>?
                    </p>
                    <div className='flex gap-2'>
                        <button
                            onClick={() => {
                                statusHandler(newStatus, orderId);
                                closeToast();
                            }}
                            className='px-2 py-1 bg-blue-500 text-white rounded'
                        >
                            Yes
                        </button>
                        <button onClick={closeToast} className='px-2 py-1 bg-gray-300 rounded'>
                            No
                        </button>
                    </div>
                </div>
            ),
            { autoClose: false }
        );
    };

    useEffect(() => {
        fetchAllOrders();
    }, [token]);

    return (
        <div>
            <h3>Order Page</h3>
            <div>
                {orders.map((order, index) => (
                    <div
                        className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700'
                        key={index}
                    >
                        <img className='w-12' src={assets.parcel_icon} alt='' />
                        <div>
                            <div>
                                {order.items.map((item, index) => (
                                    <p className='py-0.5' key={index}>
                                        {item.name} x {item.quantity}{' '}
                                        <span>
                                            {item.size}
                                            {index !== order.items.length - 1 && ','}
                                        </span>
                                    </p>
                                ))}
                            </div>
                            <p className='mt-3 mb-2 font-medium'>
                                {order.address.firstName + ' ' + order.address.lastName}
                            </p>
                            <div>
                                <p>{order.address.street + ', '}</p>
                                <p>
                                    {order.address.city +
                                        ', ' +
                                        order.address.country +
                                        ', ' +
                                        order.address.zipcode}
                                </p>
                            </div>
                            <p>{order.address.phone}</p>
                        </div>
                        <div>
                            <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
                            <p className='mt-3'>Method : {order.paymentMethod}</p>
                            <p className='mt-1'>
                                Payment :{' '}
                                <span
                                    className={`font-semibold ${
                                        order.payment ? 'text-green-600' : 'text-red-600'
                                    }`}
                                >
                                    {order.payment ? 'Done' : 'Pending'}
                                </span>
                            </p>
                            <p>Date : {new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <p className='text-sm sm:text-[15px]'>
                            {currency}{' '}
                            {order.amount.toLocaleString('en-PH', {
                                minimumFractionDigits: 2,
                            })}
                        </p>
                        <select
                            onChange={(event) => confirmStatusChange(event.target.value, order._id)}
                            value={order.status}
                            className='p-2 font-semibold'
                        >
                            <option value='Order Placed'>Order Placed</option>
                            <option value='Out for Delivery'>Out for Delivery</option>
                            <option value='Delivered'>Delivered</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
