import React from "react";
import { useState } from "react";

// all icons are imported here
import { AiOutlineShop } from "react-icons/ai";
import { LuUsers2 } from "react-icons/lu";
import { PiShoppingBagBold } from "react-icons/pi";
import { BiCategoryAlt } from "react-icons/bi";
import { GoDot } from "react-icons/go";
import { TbBrandBilibili } from "react-icons/tb";
import { IoColorPaletteOutline } from "react-icons/io5";
import { PiStack } from "react-icons/pi";
import { MdOutlineDiscount } from "react-icons/md";
import { RiCoupon4Line } from "react-icons/ri";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  const [openAccordion, setOpenAccordion] = useState(null);

  const handleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };
  return (
    <div className="bg-white w-[20%] h-full mx-14 shadow-xl">
      <Link to="/admin/dashboard">
        <h1
          className={`flex items-center text-lg gap-2 p-2 select-none cursor-pointer ${
            openAccordion === 1 ? "bg-orange-400 text-white" : ""
          }`}
          onClick={() => handleAccordion(1)}
        >
          <PiStack />
          Dashboard
        </h1>
      </Link>
      <div className="select-none">
        <h1
          className={`flex items-center gap-2 text-lg p-2 hover:cursor-pointer ${
            openAccordion === 2 ? "bg-orange-400 text-white" : ""
          }`}
          onClick={() => handleAccordion(2)}
        >
          <PiShoppingBagBold
            className={`${
              openAccordion === 2
                ? "text-white text-xl"
                : "text-xl text-gray-700"
            }`}
          />
          <span>Products</span>
        </h1>
        <div
          className={`${
            openAccordion === 2 ? "block" : "hidden"
          } px-8 py-2 space-y-2 `}
        >
          <Link to="/admin/products">
            <p className="flex items-center gap-1">
              <GoDot />
              All Products
            </p>
          </Link>
          <Link to="/admin/add-product">
            <p className="flex items-center gap-1">
              <GoDot />
              Add Products
            </p>
          </Link>
          {/* <p className='flex items-center gap-1'><GoDot />Update Products</p> */}
        </div>
      </div>
      <div className="select-none">
        <h1
          className={`flex items-center gap-2 text-lg p-2 hover:cursor-pointer ${
            openAccordion === 3 ? "bg-orange-400 text-white" : ""
          }`}
          onClick={() => handleAccordion(3)}
        >
          <BiCategoryAlt
            className={`${
              openAccordion === 3
                ? "text-white text-xl"
                : "text-xl text-gray-700"
            }`}
          />
          <span>Category</span>
        </h1>
        <div
          className={`${
            openAccordion === 3 ? "block" : "hidden"
          } px-8 py-2 space-y-2`}
        >
          {/* <p className='flex items-center gap-1'><GoDot />All Category</p> */}
          <Link to="/admin/add-category">
            <p className="flex items-center gap-1">
              <GoDot />
              Add Category
            </p>
          </Link>
          {/* <p className='flex items-center gap-1'><GoDot />Update Category</p> */}
        </div>
      </div>
      <div className="select-none">
        <h1
          className={`flex items-center gap-2 text-lg p-2 hover:cursor-pointer ${
            openAccordion === 4 ? "bg-orange-400 text-white" : ""
          }`}
          onClick={() => handleAccordion(4)}
        >
          <TbBrandBilibili
            className={`${
              openAccordion === 4
                ? "text-white text-xl"
                : "text-xl text-gray-700"
            }`}
          />
          <span>Brands</span>
        </h1>
        <div
          className={`${
            openAccordion === 4 ? "block" : "hidden"
          } px-8 py-2 space-y-2`}
        >
          {/* <p className='flex items-center gap-1'><GoDot />All Brands</p> */}
          <Link to="/admin/add-brand">
            <p className="flex items-center gap-1">
              <GoDot />
              Add Brands
            </p>
          </Link>
          {/* <p className='flex items-center gap-1'><GoDot />Update Brands</p> */}
        </div>
      </div>
      <div className="select-none">
        <h1
          className={`flex items-center gap-2 text-lg p-2 hover:cursor-pointer ${
            openAccordion === 5 ? "bg-orange-400 text-white" : ""
          }`}
          onClick={() => handleAccordion(5)}
        >
          <LuUsers2
            className={`${
              openAccordion === 5
                ? "text-white text-xl"
                : "text-xl text-gray-700"
            }`}
          />
          <span>Users</span>
        </h1>
        <div
          className={`${
            openAccordion === 5 ? "block" : "hidden"
          } px-8 py-2 space-y-2`}
        >
          <Link to="/admin/users">
            <p className="flex items-center gap-1">
              <GoDot />
              All Users
            </p>
          </Link>
          <p className="flex items-center gap-1">
            <GoDot />
            Add Users
          </p>
          <p className="flex items-center gap-1">
            <GoDot />
            Update Users
          </p>
        </div>
      </div>
      <div className="select-none">
        <h1
          className={`flex items-center gap-2 text-lg p-2 hover:cursor-pointer ${
            openAccordion === 6 ? "bg-orange-400 text-white" : ""
          }`}
          onClick={() => handleAccordion(6)}
        >
          <AiOutlineShop
            className={`${
              openAccordion === 6
                ? "text-white text-xl"
                : "text-xl text-gray-700"
            }`}
          />
          <span>Orders</span>
        </h1>
        <div
          className={`${
            openAccordion === 6 ? "block" : "hidden"
          } px-8 py-2 space-y-2`}
        >
          <Link to="/admin/orders">
            <p className="flex items-center gap-1">
              <GoDot />
              All Orders
            </p>
          </Link>
          <p className="flex items-center gap-1">
            <GoDot />
            Create Orders
          </p>
          <p className="flex items-center gap-1">
            <GoDot />
            Update Orders
          </p>
        </div>
      </div>
      <div className="select-none">
        <h1
          className={`flex items-center gap-2 text-lg p-2 hover:cursor-pointer ${
            openAccordion === 8 ? "bg-orange-400 text-white" : ""
          }`}
          onClick={() => handleAccordion(8)}
        >
          <MdOutlineDiscount
            className={`${
              openAccordion === 8
                ? "text-white text-xl"
                : "text-xl text-gray-700"
            }`}
          />
          <span>Discounts</span>
        </h1>
        <div
          className={`${
            openAccordion === 8 ? "block" : "hidden"
          } px-8 py-2 space-y-2`}
        >
          <Link to="/admin/discounts">
            <p className="flex items-center gap-1">
              <GoDot />
              All Discounts
            </p>
          </Link>
          <Link to="/admin/add-discount">
            <p className="flex items-center gap-1">
              <GoDot />
              Create Discounts
            </p>
          </Link>
          {/* <p className='flex items-center gap-1'><GoDot />Update Discounts</p> */}
        </div>
      </div>
      <div className="select-none">
        <h1
          className={`flex items-center gap-2 text-lg p-2 hover:cursor-pointer ${
            openAccordion === 9 ? "bg-orange-400 text-white" : ""
          }`}
          onClick={() => handleAccordion(9)}
        >
          <RiCoupon4Line
            className={`${
              openAccordion === 9
                ? "text-white text-xl"
                : "text-xl text-gray-700"
            }`}
          />
          <span>Coupons</span>
        </h1>
        <div
          className={`${
            openAccordion === 9 ? "block" : "hidden"
          } px-8 py-2 space-y-2`}
        >
          <Link to="/admin/coupons">
            <p className="flex items-center gap-1">
              <GoDot />
              All Coupons
            </p>
          </Link>
          <Link to="/admin/add-coupon">
            <p className="flex items-center gap-1">
              <GoDot />
              Create Coupons
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
