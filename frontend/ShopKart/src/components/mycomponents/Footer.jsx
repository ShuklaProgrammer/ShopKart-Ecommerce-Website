import React from 'react'

// all icons are imported here
import { FaShoppingBag } from 'react-icons/fa'
import { IoLogoGooglePlaystore } from "react-icons/io5";
import { FaApple } from "react-icons/fa";
import { IoMdArrowForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate()

  return (
    <>
    <footer className='bg-gray-900 flex flex-wrap justify-between gap-10 py-10 px-20'>
    <section className='hidden sm:block'>
    <h1 className='text-2xl font-extrabold text-white flex gap-2'><FaShoppingBag className='text-3xl text-orange-400' />ShopKart</h1>
    <ul className='text-white space-y-2 mt-10'>
    <li className='text-sm text-gray-400'>Customer Supports:</li>
    <li>(629) 555-0129</li>
    <li className='text-sm text-gray-400'>4517 Washington Ave.<br/> Manchester, Kentucky 39495</li>
    <li>
    info@kinbo.com
    </li>
    </ul>
    </section>

    <section>
    <h2 className='text-white text-base uppercase'>Top Category</h2>
    <ul className='text-gray-400 text-sm mt-3 space-y-3'>
      <li className='hover:underline hover:cursor-pointer' onClick={() => navigate("/shop?category=Laptop")}>Computer & Laptop</li>
      <li className='hover:underline hover:cursor-pointer' onClick={() => navigate("/shop?category=SmartPhone")}>SmartPhone</li>
      <li className='hover:underline hover:cursor-pointer' onClick={() => navigate("/shop?category=Headphone")}>Headphone</li>
      <li className='hover:underline hover:cursor-pointer' onClick={() => navigate("/shop?category=Accessories")}>Accessories</li>
      <li className='hover:underline hover:cursor-pointer' onClick={() => navigate("/shop?category=Samsung")}>Camera & Photo</li>
      <li className='hover:underline hover:cursor-pointer' onClick={() => navigate("/shop?category=Samsung")}>TV & Homes</li>
      <li className='text-yellow-400 flex items-center hover:underline hover:cursor-pointer' onClick={() => navigate("/shop")}>Browse All Product<IoMdArrowForward className='text-xl ml-2'/></li>
    </ul>
    </section>

    <section>
      <h2 className='text-white text-base uppercase'>Quick links</h2>
      <ul className='text-gray-400 text-sm mt-3 space-y-3'>
        <li className='hover:underline hover:cursor-pointer' onClick={() => navigate("/shop")}>Shop Product</li>
        <li className='hover:underline hover:cursor-pointer' onClick={() => navigate("/cart")}>Shoping Cart</li>
        <li className='hover:underline hover:cursor-pointer' onClick={() => navigate("/wishlist")}>Wishlist</li>
        <li className='hover:underline hover:cursor-pointer' onClick={() => navigate("/track-order")}>Track Order</li>
        <li className='hover:underline hover:cursor-pointer'>Customer Help</li>
        <li className='hover:underline hover:cursor-pointer'>About Us</li>
      </ul>
    </section>

    <section className='space-y-5 text-sm'>
      <h2 className='text-white text-base'>DOWNLOAD APP</h2>
      <div className='bg-gray-700 hover:bg-gray-500 flex items-center gap-5 py-3 px-5 hover:cursor-pointer'>
        <IoLogoGooglePlaystore className='text-white text-4xl'/>
        <div className='text-white'>
          <p className='text-sm'>Get it now</p>
          <span className='text-base'>Google Play</span>
        </div>
      </div>
      <div className='bg-gray-700 hover:bg-gray-500 flex items-center gap-5 py-3 px-5 hover:cursor-pointer'>
        <FaApple className='text-white text-4xl'/>
        <div className='text-white'>
          <p className='text-sm'>Get it now</p>
          <span className='text-base'>App Store</span>
        </div>
      </div>
    </section>

    <section className='text-white text-sm'>
      <h2 className='text-white w-full text-lg'>Popular Tag</h2>
      <div className='grid grid-cols-3 gap-2'>
      <span className='border border-2 border-gray-600 px-2 py-1 hover:bg-gray-600 hover:cursor-pointer' onClick={() => navigate("/shop?tags=game")}>Game</span>
      <span className='border border-2 border-gray-600 px-2 py-1 hover:bg-gray-600 hover:cursor-pointer' onClick={() => navigate("/shop?tags=samsung")}>iPhone</span>
      <span className='border border-2 border-gray-600 px-2 py-1 hover:bg-gray-600 hover:cursor-pointer' onClick={() => navigate("/shop?tags=samsung")}>TV</span>
      <span className='border border-2 border-gray-600 px-2 py-1 hover:bg-gray-600 hover:cursor-pointer' onClick={() => navigate("/shop?tags=samsung")}>Macbook </span>
      <span className='border border-2 border-gray-600 px-2 py-1 hover:bg-gray-600 hover:cursor-pointer' onClick={() => navigate("/shop?tags=samsung")}>SSD</span>
      <span className='border border-2 border-gray-600 px-2 py-1 hover:bg-gray-600 hover:cursor-pointer' onClick={() => navigate("/shop?tags=samsung")}>Graphics Card </span>
      <span className='border border-2 border-gray-600 px-2 py-1 hover:bg-gray-600 hover:cursor-pointer' onClick={() => navigate("/shop?tags=samsung")}>Power Bank </span>
      <span className='border border-2 border-gray-600 px-2 py-1 hover:bg-gray-600 hover:cursor-pointer' onClick={() => navigate("/shop?tags=samsung")}>Smart TV</span>
      <span className='border border-2 border-gray-600 px-2 py-1 hover:bg-gray-600 hover:cursor-pointer' onClick={() => navigate("/shop?tags=samsung")}>Speaker</span>
      <span className='border border-2 border-gray-600 px-2 py-1 hover:bg-gray-600 hover:cursor-pointer' onClick={() => navigate("/shop?tags=samsung")}>Tablet</span>
      <span className='border border-2 border-gray-600 px-2 py-1 hover:bg-gray-600 hover:cursor-pointer' onClick={() => navigate("/shop?tags=samsung")}>Microwave</span>
      <span className='border border-2 border-gray-600 px-2 py-1 hover:bg-gray-600 hover:cursor-pointer' onClick={() => navigate("/shop?tags=samsung")}>Samsung</span>
      </div>
    </section>

    <hr className='w-full border border-gray-600'/>
    <section className='text-sm flex justify-center w-full'>
      <h1 className='text-gray-400'>© Copyright 2024-2025</h1>
    </section>
    </footer>
    </>
  )
}

export default Footer