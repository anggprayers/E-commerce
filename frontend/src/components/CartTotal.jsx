import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = () => {
    const { currency, getCartAmount } = useContext(ShopContext);

    // Formatted Total Amount
    const formattedAmount = getCartAmount().toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={'CART'} text2={'TOTAL'} />
            </div>
            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Subtotal</p>
                    <p>
                        {currency}
                        {formattedAmount}
                    </p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <b>Total</b>
                    <b>
                        {currency}
                        {formattedAmount}
                    </b>
                </div>
            </div>
        </div>
    );
};

export default CartTotal;
