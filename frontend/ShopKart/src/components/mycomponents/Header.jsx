import React, { useEffect, useState } from "react";

//all the icons are imported here
import {
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaFacebook,
  FaReddit,
  FaShoppingBag,
} from "react-icons/fa";
import { FaPinterestP } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { SlLocationPin } from "react-icons/sl";
import { FiHeadphones } from "react-icons/fi";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FiPhoneCall } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";

// importing components from shadcn
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "../ui/input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutUserMutation } from "@/redux/api/authApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import { updateSearch } from "@/redux/features/product/productSlice";
import { useGetAllCategoryQuery } from "@/redux/api/categoryApiSlice";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("search") || "";
  const [searching, setSearching] = useState("");

  const [dropdownOpen, setDropdownOpen] = useState(false);

   const { toast } = useToast();

  const { userInfo } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart.cart);

  const [logoutUser] = useLogoutUserMutation();
  const { data: getAllCategory } = useGetAllCategoryQuery();
  const categories = getAllCategory?.data || [];

  const [isClickedNavigationMenuTrigger, setIsClickNavigationMenuTrigger] =
    useState(false);

  const clickNavigationMenuTrigger = () => {
    setIsClickNavigationMenuTrigger(!isClickedNavigationMenuTrigger);
  };

  const handleLogoutUser = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.log("Cannot logout", error);
    }
  };

  useEffect(() => {
    setSearching(searchTerm);
  }, [searchTerm]);

  const handleSearchProduct = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      dispatch(updateSearch(searching));
      navigate(`/shop?search=${encodeURIComponent(searching)}`);
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/shop/?category=${categoryName}`);
  };

  const handleTrackOrderClick = () => {
    try {
      if(!userInfo?._id){
        toast({
          title: "Login required",
          description: "You need to log in order to track order.",
        });
        navigate("/auth");
      }else{
        navigate("/track-order")
      }
    } catch (error) {
      console.log("Something Error", error)
    }
  }

  return (
    <>
      <header className="bg-blue-600">
        <nav className="flex flex-col gap-2 sm:flex-row mx-5 md:mx-10 lg:mx-20 justify-between items-center">
          {/* Welcome message */}
          <p className="text-sm text-white py-2">
            Welcome to ShopKart online ecommerce store
          </p>

          <div className="sm:flex flex-col hidden sm:flex-row sm:gap-10 sm:mt-0">
            {/* Social media icons */}
            <ul className="flex items-center gap-2">
              <li className="text-white text-sm">Follow us:</li>
              <li>
                <FaTwitter className="text-base text-white" />
              </li>
              <li>
                <FaFacebook className="text-base text-white" />
              </li>
              <li>
                <FaPinterestP className="text-base text-white" />
              </li>
              <li>
                <FaReddit className="text-base text-white" />
              </li>
              <li>
                <FaYoutube className="text-base text-white" />
              </li>
              <li>
                <FaInstagram className="text-base text-white" />
              </li>
            </ul>

            {/* Language and currency */}
            <ul className="flex gap-5 sm:hidden md:flex">
              <li className="text-white text-sm">
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
              <li className="text-white text-sm">
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
        <nav className="flex items-center justify-between py-3 mx-2 lg:mx-20">
          <Link to="/">
            <h1 className="lg:text-2xl text-xl font-extrabold text-white flex gap-2 select-none">
              <FaShoppingBag className="text-3xl" />
              ShopKart
            </h1>
          </Link>

          <div className="md:flex items-center relative w-[40%] hidden">
            <Input
              value={searching}
              onChange={(e) => setSearching(e.target.value)}
              onKeyDown={handleSearchProduct}
              className="rounded-sm w-full"
              placeholder="Search for anything..."
            />
            <FaSearch
              onClick={handleSearchProduct}
              className="absolute text-gray-500 right-2 hover:cursor-pointer hover:text-orange-400"
            />
          </div>

          <ul className="flex items-center text-white gap-4">
            <li>
              {userInfo ? (
                <DropdownMenu
                  open={dropdownOpen}
                  onOpenChange={setDropdownOpen}
                >
                  <DropdownMenuTrigger className="flex items-center gap-2">
                    <Link
                      to="/auth"
                      className="flex justify-center items-center gap-2 hover:bg-orange-400 px-4 py-2 rounded-md"
                    >
                      <AiOutlineUser className="text-2xl" />
                      <span className="sm:flex hidden text-sm lg:text-base">
                        {userInfo.username}
                      </span>
                    </Link>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent onClick={() => setDropdownOpen(false)}>
                    <Link to="/profile/dashboard">
                      <p className="hover:bg-gray-200 cursor-pointer p-1 flex items-center gap-2 pr-20">
                        <CgProfile className="text-lg" />
                        Profile
                      </p>
                    </Link>
                    {userInfo.role === "admin" && (
                      <Link to="/admin/dashboard">
                        <p className="hover:bg-gray-200 cursor-pointer p-1 flex items-center gap-2 pr-20">
                          <RiAdminLine className="text-lg" />
                          Admin Panel
                        </p>
                      </Link>
                    )}
                    <p
                      className="hover:bg-gray-200 cursor-pointer p-1 flex items-center gap-2 pr-20"
                      onClick={handleLogoutUser}
                    >
                      <FiLogOut />
                      Logout
                    </p>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center gap-2 hover:bg-orange-400 py-2 px-4 rounded-md"
                >
                  <AiOutlineUser className="text-2xl" />
                  <span className="text-sm lg:text-base">Login</span>
                </Link>
              )}
            </li>
            <li className="relative">
              <Link to="/cart" className="flex items-center gap-2">
                <div className="relative">
                  <FiShoppingCart className="text-xl" />
                  {cart?.cartItems?.length > 0 && userInfo && (
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-xs bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white font-semibold">
                      {cart.cartItems.length}
                    </span>
                  )}
                </div>
                <span className="sm:flex hidden text-sm lg:text-base">
                  Cart
                </span>
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="flex items-center gap-2">
                <FaRegHeart className="text-xl" />
                <span className="sm:flex hidden text-sm lg:text-base">
                  Wishlist
                </span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center justify-center mx-2">
          <div className="md:hidden flex items-center pb-4 relative w-full">
            <Input
              value={searching}
              onChange={(e) => setSearching(e.target.value)}
              onKeyDown={handleSearchProduct}
              className="rounded-sm w-full"
              placeholder="Search for anything..."
            />
            <FaSearch
              onClick={handleSearchProduct}
              className="absolute text-gray-500 right-2 hover:cursor-pointer hover:text-orange-400"
            />
          </div>
        </div>

        <nav className="bg-white flex items-center justify-between border-b-2 py-2 px-2 md:px-5 hidden md:flex">
          <ul className="flex items-center gap-3">
            <li>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      onClick={clickNavigationMenuTrigger}
                      className={`bg-gray-100 rounded-sm px-3 py-5 text-black ${
                        isClickedNavigationMenuTrigger
                          ? "bg-orange-400 text-white"
                          : "hover:bg-orange-400 hover:text-white"
                      }`}
                    >
                      All Category
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="min-w-[200px]">
                      {categories.map((category, index) => (
                        <NavigationMenuLink
                          key={index}
                          onClick={() =>
                            handleCategoryClick(category.categoryName)
                          }
                          className="block px-4 py-2 hover:bg-gray-200 cursor-pointer"
                        >
                          {category.categoryName}
                        </NavigationMenuLink>
                      ))}
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </li>
            <li
            onClick={() => handleTrackOrderClick()}
                className="flex items-center gap-1 text-sm hover:cursor-pointer text-gray-500"
              >
                <SlLocationPin className="text-lg text-gray-600" />
                Track Order
            </li>
            {/* <li className='flex items-center gap-1 text-sm hover:cursor-pointer text-gray-500'><FiRefreshCcw className='text-lg text-gray-600' />Compare</li> */}
            <li className="flex items-center gap-1 text-sm hover:cursor-pointer text-gray-500">
              <FiHeadphones className="text-lg text-gray-600" />
              Customer Support
            </li>
            <li className="flex items-center gap-1 text-sm hover:cursor-pointer text-gray-500">
              <AiOutlineInfoCircle className="text-lg text-gray-600" />
              Need Help
            </li>
          </ul>

          <p className="flex items-center gap-1 text-sm hover:cursor-pointer text-gray-500">
            <FiPhoneCall className="text-lg text-gray-600" />
            +1-202-555-0104
          </p>
        </nav>
      </header>
    </>
  );
};

export default Header;
