import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const List = ({ token }) => {
    const [list, setList] = useState([]);
    const fetchList = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if (response.data.success) {
                setList(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const removeProduct = async (id) => {
        try {
            const response = await axios.post(
                backendUrl + '/api/product/remove',
                { id },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                await fetchList();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // custom confirm toast
    const confirmDelete = (id) => {
        toast(
            ({ closeToast }) => (
                <div className='flex flex-col gap-2'>
                    <p>Are you sure you want to delete this product?</p>
                    <div className='flex gap-2'>
                        <button
                            onClick={() => {
                                removeProduct(id);
                                closeToast();
                            }}
                            className='px-2 py-1 bg-red-500 text-white rounded'
                        >
                            Yes
                        </button>
                        <button onClick={closeToast} className='px-2 py-1 bg-gray-300 rounded'>
                            No
                        </button>
                    </div>
                </div>
            ),
            { autoClose: false } // don’t auto close until user acts
        );
    };

    useEffect(() => {
        fetchList();
    }, []);
    return (
        <>
            <p className='mb-2'>All Products</p>
            <div className='flex flex-col gap-2'>
                {/* ------------- List Table Title -------------- */}
            </div>
            <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] item-center py-1 px-2 border bg-gray-100 text-sm'>
                <b>Image</b>
                <b>Name</b>
                <b>Category</b>
                <b>Price</b>
                <b className='text-center'>Action</b>
            </div>

            {/* ------------- Product List ---------------- */}
            {list.map((item, index) => (
                <div
                    className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm'
                    key={index}
                >
                    <img className='w-12' src={item.image[0]} alt='' />
                    <p>{item.name}</p>
                    <p>{item.category}</p>
                    <p>
                        {currency}{' '}
                        {item.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </p>
                    {/* Action buttons */}
                    <div className='flex justify-center gap-3'>
                        <img
                            src={assets.edit_icon}
                            alt='Edit'
                            className='w-5 h-5 cursor-pointer'
                            onClick={() => (window.location.href = `/edit/${item._id}`)}
                        />
                        <img
                            src={assets.delete_icon}
                            alt='Delete'
                            className='w-5 h-5 cursor-pointer'
                            onClick={() => confirmDelete(item._id)}
                        />
                    </div>
                </div>
            ))}
        </>
    );
};

export default List;
