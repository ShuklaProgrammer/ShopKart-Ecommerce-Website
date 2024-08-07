import React, { useEffect, useState } from 'react'

//all the icons are imported here
import { FaInstagram, FaTwitter, FaYoutube, FaFacebook, FaReddit, FaShoppingBag } from "react-icons/fa";
import { FaPinterestP } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { SlLocationPin } from "react-icons/sl";
import { FiRefreshCcw } from "react-icons/fi";
import { FiHeadphones } from "react-icons/fi";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FiPhoneCall } from "react-icons/fi";



// importing components from shadcn
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from '../ui/input';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutUserMutation } from '@/redux/api/authApiSlice';
import { logout } from "../../redux/features/auth/authSlice"
import { useGetAllProductQuery } from '@/redux/api/productApiSlice';
import { updateSearch } from '@/redux/features/product/productSlice';


const Header = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const searchTerm = searchParams.get("search") || ""
  const [searching, setSearching] = useState("")

  const { userInfo } = useSelector((state) => state.auth)
  const cart = useSelector((state) => state.cart.cart)

  const [logoutUser] = useLogoutUserMutation()

  const [isClickedNavigationMenuTrigger, setIsClickNavigationMenuTrigger] = useState(false)

  const clickNavigationMenuTrigger = () => {
    setIsClickNavigationMenuTrigger(!isClickedNavigationMenuTrigger)
  }

  const handleLogoutUser = async () => {
    try {
      await logoutUser()
      dispatch(logout())
      navigate("/")
      // console.log("logout successfully")
    } catch (error) {
      console.log("Cannot logout", error)
    }
  }

  useEffect(()=>{
    setSearching(searchTerm)
  }, [searchTerm])

  
  const handleSearchProduct = (e) => {
    if(e.key === "Enter" || e.type === "click"){
        dispatch(updateSearch(searching))
        navigate(`/shop?search=${encodeURIComponent(searching)}`)
    }
}

  return (
    <>
      <header className='bg-blue-600'>
        <nav className='flex flex-col sm:flex-row mx-10 sm:mx-20 justify-between items-center'>

          {/* Welcome message */}
          <p className='text-sm text-white'>Welcome to ShopKart online ecommerce store</p>

          <div className='flex gap-6 sm:gap-10 sm:mt-0'>

            {/* Social media icons */}
            <ul className='flex items-center gap-2'>
              <li className='text-white text-sm'>Follow us:</li>
              <li><FaTwitter className='text-base text-white' /></li>
              <li><FaFacebook className='text-base text-white' /></li>
              <li><FaPinterestP className='text-base text-white' /></li>
              <li><FaReddit className='text-base text-white' /></li>
              <li><FaYoutube className='text-base text-white' /></li>
              <li><FaInstagram className='text-base text-white' /></li>
            </ul>

            {/* Language and currency */}
            <ul className='flex gap-5'>
              <li className='text-white text-sm'>
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Eng</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <NavigationMenuLink>Link</NavigationMenuLink>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </li>
              <li className='text-white text-sm'>
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>USD</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <NavigationMenuLink>Link</NavigationMenuLink>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </li>
            </ul>
          </div>
        </nav>
        <hr />
        <nav className='flex items-center justify-between py-3 mx-2 sm:mx-20'>
          <Link to="/">
            <h1 className='text-2xl font-extrabold text-white flex gap-2 select-none'>
              <FaShoppingBag className='text-3xl' />
              ShopKart
            </h1>
          </Link>

          <div className='flex items-center relative w-[40%]'>
            <Input value={searching} onChange={e=>setSearching(e.target.value)} onKeyDown={handleSearchProduct} className="rounded-sm" placeholder="Search for anything..." />
            <FaSearch onClick={handleSearchProduct} className='absolute text-gray-500 right-2 hover:cursor-pointer hover:text-orange-400' />
          </div>

          <ul className='flex items-center text-white gap-4'>
            <li>
              {userInfo ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className='flex items-center gap-2'>
                    <Link to="/auth" className='flex justify-center items-center gap-2 hover:bg-orange-400 px-4 py-2 rounded-md'>
                      <AiOutlineUser className='text-2xl' />
                      <span>{userInfo.username}</span>
                    </Link>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Link to="/profile"><p className='hover:bg-gray-200 cursor-pointer p-1'>Profile</p></Link>
                    {userInfo.role === "admin" && (
                    <Link to="/admin/dashboard"><p className='hover:bg-gray-200 cursor-pointer p-1'>Admin Panel</p></Link>
                    )}
                    <p className='hover:bg-gray-200 cursor-pointer p-1' onClick={handleLogoutUser}>Logout</p>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth" className='flex items-center gap-2 hover:bg-orange-400 py-2 px-4 rounded-md'>
                  <AiOutlineUser className='text-2xl' />
                  <span>Login</span>
                </Link>
              )}
            </li>
            <li className='relative'>
              <Link to="/cart" className='flex items-center gap-2'>
                <div className='relative'>
                  <FiShoppingCart className='text-xl' />
                  {cart?.cartItems?.length > 0 && userInfo && (
                    <span className='absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-xs bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white font-semibold'>
                      {cart.cartItems.length}
                    </span>
                    )}
                </div>
                <span>Cart</span>
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className='flex items-center gap-2'>
                <FaRegHeart className='text-xl' />
                <span>Wishlist</span>
              </Link>
            </li>
          </ul>
        </nav>

        <nav className='bg-white flex items-center justify-between border-b-2 py-2 px-2 md:px-5 hidden md:flex'>
          <ul className='flex items-center gap-3'>
            <li>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger onClick={clickNavigationMenuTrigger} className={`bg-gray-100 rounded-sm px-3 py-5 text-black ${isClickedNavigationMenuTrigger ? "bg-orange-400 text-white" : "hover:bg-orange-400 hover:text-white"}`}>All Category</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <NavigationMenuLink>Computer & Laptop</NavigationMenuLink>
                      <NavigationMenuLink>Computer Accessories</NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

            </li>
            <li>
              <Link to="/track-order" className='flex items-center gap-1 text-sm hover:cursor-pointer text-gray-500'>
                <SlLocationPin className='text-lg text-gray-600' />
                Track Order
              </Link>
            </li>
            {/* <li className='flex items-center gap-1 text-sm hover:cursor-pointer text-gray-500'><FiRefreshCcw className='text-lg text-gray-600' />Compare</li> */}
            <li className='flex items-center gap-1 text-sm hover:cursor-pointer text-gray-500'><FiHeadphones className='text-lg text-gray-600' />Customer Support</li>
            <li className='flex items-center gap-1 text-sm hover:cursor-pointer text-gray-500'><AiOutlineInfoCircle className='text-lg text-gray-600' />Need Help</li>
          </ul>


          <p className='flex items-center gap-1 text-sm hover:cursor-pointer text-gray-500'><FiPhoneCall className="text-lg text-gray-600" />+1-202-555-0104</p>

        </nav>
      </header>
    </>
  )
}

export default Header