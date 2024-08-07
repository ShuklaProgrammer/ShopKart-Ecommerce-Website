import React, { useState } from 'react'

//all the icons are imported here
import { AiOutlineDashboard, AiOutlineHistory, AiOutlineShop } from "react-icons/ai";
import { FiRefreshCcw, FiSettings, FiShoppingCart } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineIdcard } from "react-icons/ai";
import { FaRegHeart } from 'react-icons/fa';
import { PiStack } from "react-icons/pi";
import { SlLocationPin } from 'react-icons/sl';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutUserMutation } from '@/redux/api/authApiSlice';
import { logout } from '@/redux/features/auth/authSlice';

const ProfileSidebar = () => {

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const { userInfo } = useSelector((state) => state.auth)

  const [logoutUser] = useLogoutUserMutation()

  const handleUserLogout = async () => {
    try {
      if (userInfo) {
        await logoutUser()
        dispatch(logout())
        navigate("/")
      }
    } catch (error) {
      console.log("Logout failed", error)
    }
  }

  const currentPath = location.pathname

  return (
    <section className='p-10'>
      <main>
        <div className='flex flex-col bg-white shadow-2xl w-56'>
          <Link to="/profile/dashboard"><span className={`flex items-center gap-2 p-2 hover:bg-orange-400 hover:text-white ${currentPath === "/profile/dashboard" ? "bg-orange-400 text-white" : ""}`}><PiStack />Dashboard</span></Link>
          <Link to="/profile/orders"><span className={`flex items-center gap-2 p-2 hover:bg-orange-400 hover:text-white ${currentPath === "order-history" ? "bg-orange-400 text-white" : ""}`}><AiOutlineShop /> Order History</span></Link>
          <Link to="/track-order"><span className={`flex items-center gap-2 p-2 hover:bg-orange-400 hover:text-white ${currentPath === "track-order" ? "bg-orange-400 text-white" : ""}`}><SlLocationPin />Track Order</span></Link>
          <Link to="/wishlist"><span className={`flex items-center gap-2 p-2 hover:bg-orange-400 hover:text-white ${currentPath === "/wishlist" ? "bg-orange-400 text-white" : ""}`}><FaRegHeart />Wishlist</span></Link>
          <Link to="/cart"><span className={`flex items-center gap-2 p-2 hover:bg-orange-400 hover:text-white ${currentPath === "/cart" ? "bg-orange-400 text-white" : ""}`}><FiShoppingCart />Shopping Cart</span></Link>
          {/* <Link ><span className={`flex items-center gap-2 p-2 hover:bg-orange-400 hover:text-white ${currentPath === "compare" ? "bg-orange-400 text-white" : ""}`}><FiRefreshCcw />Compare</span></Link> */}
          <Link to="/profile/address"><span className={`flex items-center gap-2 p-2 hover:bg-orange-400 hover:text-white ${currentPath === "/profile/address" ? "bg-orange-400 text-white" : ""}`}><AiOutlineIdcard />Cards & Address</span></Link>
          {/* <Link><span className={`flex items-center gap-2 p-2 hover:bg-orange-400 hover:text-white ${currentPath === "browsing-history" ? "bg-orange-400 text-white" : ""}`}><AiOutlineHistory />Browsing History</span></Link> */}
          <Link to="/profile/setting"><span className={`flex items-center gap-2 p-2 hover:bg-orange-400 hover:text-white ${currentPath === "/profile/setting" ? "bg-orange-400 text-white" : ""}`}><FiSettings />Setting</span></Link>
          <Link onClick={handleUserLogout}><span className={`flex items-center gap-2 p-2 hover:bg-orange-400 hover:text-white ${currentPath === "log-out" ? "bg-orange-400 text-white" : ""}`}><FiLogOut />Log-out</span></Link>
        </div>
      </main>
    </section>
  )
}

export default ProfileSidebar