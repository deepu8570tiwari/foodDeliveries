import React from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom'

function CartPage() {
    const navigate=useNavigate();
  return (
    <div className='min-h-screen bg-[#fff9f6] flex justify-center p-6'>
        <div className='w-full max-w-[800px]'>
            <div className='flex items-center gap-5 mb-6'>
                <div className=' z-10 ' onClick={()=>navigate("/")}>
                    <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]'/>
                </div>
                <h1 className='text-2xl font-bold text-start'> Your Cart</h1>
            </div>
        </div>
    </div>
  )
}

export default CartPage
