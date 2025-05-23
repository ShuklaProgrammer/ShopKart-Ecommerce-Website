import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

// all the icons are imported here
import { IoMdArrowForward } from "react-icons/io";
import { BsBoxSeam } from "react-icons/bs";
import { CiTrophy } from "react-icons/ci";
import { GoCreditCard } from "react-icons/go";
import { CiHeadphones } from "react-icons/ci";

import { useGetAllProductQuery } from "@/redux/api/productApiSlice";
import { Link } from "react-router-dom";
import Loader from "@/components/mycomponents/Loader";

const Home = () => {
  const [showMessage, setShowMessage] = useState(false);

  const { data: productData, isLoading: isProductsLoading } =
    useGetAllProductQuery({});

  const products = productData?.data?.products || [];

  const isLoading = isProductsLoading;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader size="4em" topBorderSize="0.3em" />
        {showMessage && (
          <p className="font-bold text-center mx-4">
            Please wait... Retrieving data from the Render backend.
          </p>
        )}
      </div>
    );
  }

  return (
    <section className="home-section flex justify-center mt-5">
      <main className="bg-white w-[90%] h-full">
        <section className="lg:flex gap-5">
          {products?.slice(0, 1).map((product, index) => (
            <div
              key={index}
              className="container1 flex justify-center items-center py-4 lg:py-0 px-4 w-full gap-10 border-2 rounded-md"
            >
              <div className="w-full space-y-4">
                <span className="uppercase font-medium text-blue-500">
                  ――The Real World Experience
                </span>
                <div className="w-80 bg-red-300 block sm:hidden">
                  <img
                    src={product.productImage[0]}
                    alt=""
                    className="rounded-md"
                    loading="lazy"
                  />
                </div>
                <p className="text-gray-700">
                  Save big on your next holiday on SmartPhone. Get 2 months
                  Subscription for Netflix, Prime Video, Youtube.
                </p>
                <Link to={`/product-details/${product._id}`}>
                  <Button className="mt-4" variant="shop">
                    Shop Now
                    <IoMdArrowForward className="text-white text-xl ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="w-80 bg-red-300 hidden sm:block">
                <img src={product.productImage[0]} alt="" className="" loading="lazy" />
              </div>
            </div>
          ))}
          <div className="container2 flex flex-col lg:w-[60%] lg:mt-0 mt-4 gap-5">
            {products?.slice(1, 2).map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between lg:px-8 px-4 py-4 border-2 rounded-md"
              >
                <div className="space-y-3">
                  <span className="uppercase text-yellow-500 font-semibold">
                    Summer Sales
                  </span>
                  <div className="w-40 sm:hidden block">
                    <img
                      src={product.productImage[0]}
                      alt=""
                      className="rounded-md"
                      loading="lazy"
                    />
                  </div>
                  <h2 className="text-xl font-semibold">
                    {product.title}
                  </h2>
                  <Link to={`/product-details/${product._id}`}>
                    <Button className="mt-4" variant="shop">
                      Shop Now
                      <IoMdArrowForward className="text-xl ml-2" />
                    </Button>
                  </Link>
                </div>
                <div className="w-40 hidden sm:block">
                  <img
                    src={product.productImage[0]}
                    alt=""
                    className="rounded-md"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
            {products?.slice(2, 3).map((product, index) => (
              <div
                key={index}
                className="sm:flex items-center justify-between gap-4 sm:px-8 px-4 py-4 border-2 rounded-md"
              >
                <div className="w-40">
                  <img
                    src={product.productImage[0]}
                    alt=""
                    className="rounded-md"
                    loading="lazy"
                  />
                </div>
                <div className="sm:flex flex flex-col items-start justify-start space-y-3">
                  <h2 className="text-xl font-semibold">{product.title}</h2>
                  <span className="uppercase font-semibold text-blue-500">
                    ${product.price}
                  </span>
                  <Link to={`/product-details/${product._id}`}>
                    <Button variant="shop">
                      Shop Now
                      <IoMdArrowForward className="text-xl ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 lg:flex lg:justify-between lg:px-10 lg:py-5 border-2 border-solid border-gray-200 mt-5">
          <div className="p-2 lg:p-0 lg:flex items-center gap-3 flex">
            <BsBoxSeam className="text-2xl text-gray-700" />
            <div className="">
              <h3 className="text-sm font-semibold text-gray-700">
                Fasted Delievry
              </h3>
              <p className="text-xs text-gray-500">Delivery in 24/H</p>
            </div>
          </div>

          {/* a vertical line */}
          <div className="lg:border border-gray-300"></div>

          <div className="p-2 lg:p-0 sm:flex items-center gap-3 flex">
            <CiTrophy className="text-3xl text-gray-700" />
            <div>
              <h3 className="text-sm font-semibold text-gray-700">
                24 Hours Return
              </h3>
              <p className="text-xs text-gray-500">100% money-back guarantee</p>
            </div>
          </div>

          {/* a vertical line */}
          <div className="lg:border border-gray-300"></div>

          <div className="p-2 lg:p-0 sm:flex items-center gap-3 flex">
            <GoCreditCard className="text-2xl text-gray-700" />
            <div>
              <h3 className="text-sm font-semibold text-gray-700">
                Secure Payment
              </h3>
              <p className="text-xs text-gray-500">Your money is safe</p>
            </div>
          </div>

          {/* a vertical line */}
          <div className="lg:border border-gray-300"></div>

          <div className="p-2 lg:p-0 sm:flex items-center gap-3 flex">
            <CiHeadphones className="text-3xl text-gray-700" />
            <div>
              <h3 className="text-sm font-semibold text-gray-700">
                Support 24/7
              </h3>
              <p className="text-xs text-gray-500">Live contact/message</p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="sm:flex sm:items-center sm:gap-5">
            <h1 className="text-2xl font-semibold">Best Deals</h1>
          </div>

          <div className="mt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {products.slice(3, 13).map((product, index) => (
                <Link key={index} to={`/product-details/${product._id}`}>
                  <div className="border-2 py-4 hover:shadow-2xl hover:border-0">
                    <div className="w-56 h-56 mx-auto overflow-hidden">
                      <img
                        src={product.productImage[0]}
                        alt=""
                        className="w-full h-full mb-3 object-contain"
                        loading="lazy"
                      />
                    </div>
                    <p className="line-clamp-2 leading-tight text-sm px-4 mb-2">
                      {product.title}
                    </p>
                    <span className="pl-4">${product.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* banner section */}

        <section className="lg:flex space-y-4 lg:space-y-0 justify-between gap-5 lg:mt-20 mt-4">
          {products.slice(13, 14).map((product, index) => (
            <div
              key={index}
              className="flex border-2 rounded-md p-5 items-center gap-5"
            >
              <div className="space-y-2">
                <span className="uppercase bg-sky-400 text-white px-2 py-1 rounded">
                  Introducing
                </span>
                <h2 className="text-2xl font-semibold line-clamp-1">
                  {product.title}
                </h2>
                <img
                  src={product.productImage[0]}
                  alt=""
                  className="w-56 h-56 block sm:hidden"
                  loading="lazy"
                />
                <p className="line-clamp-2">
                  Jam-packed with innovation, HomePod mini delivers
                  unexpectedly.
                </p>
                <Link to={`/product-details/${product._id}`}>
                  <Button className="mt-4" variant="shop">
                    Shop Now
                    <IoMdArrowForward className="text-white text-xl ml-2" />
                  </Button>
                </Link>
              </div>
              <img
                src={product.productImage[0]}
                alt=""
                className="w-56 h-56 hidden sm:block"
                loading="lazy"
              />
            </div>
          ))}
          {products.slice(14, 15).map((product, index) => (
            <div
              key={index}
              className="flex border-2 rounded-md p-5 items-center gap-5"
            >
              <div className="space-y-2">
                <span className="uppercase bg-yellow-300 py-1 px-2 rounded text-sm md:text-base">
                  Introducing New
                </span>
                <h2 className="text-2xl font-semibold line-clamp-1">
                  {product.title}
                </h2>
                <img
                  src={product.productImage[0]}
                  alt=""
                  className="w-56 h-56 block sm:hidden"
                  loading="lazy"
                />
                <p className="line-clamp-2">
                  *Data provided by internal laboratories. Industry measurment.
                </p>
                <Link to={`/product-details/${product._id}`}>
                  <Button className="mt-4" variant="shop">
                    Shop Now
                    <IoMdArrowForward className="text-white text-xl ml-2" />
                  </Button>
                </Link>
              </div>
              <img
                src={product.productImage[0]}
                alt=""
                className="w-56 h-56 hidden sm:block"
                loading="lazy"
              />
            </div>
          ))}
        </section>

        {products.slice(15, 16).map((product, index) => (
          <section
            key={index}
            className="flex justify-between items-center lg:px-20 px-4 py-4 lg:py-0 border-2 mt-10 rounded-md mb-10"
          >
            <div className="space-y-3">
              <span className="bg-blue-400 rounded-sm px-2 py-1 text-white">
                SAVE UP TO $200.00
              </span>
              <h1 className="text-3xl font-semibold">Macbook Pro</h1>
              <img
                src="https://m.media-amazon.com/images/I/71an9eiBxpL._SL1500_.jpg"
                alt=""
                className="w-56 h-56 sm:hidden block"
                loading="lazy"
              />
              <p className="line-clamp-2">{product.title}</p>
              <Link to={`/product-details/${product._id}`}>
                <Button className="mt-4" variant="shop">
                  Shop Now
                  <IoMdArrowForward />
                </Button>
              </Link>
            </div>

            <img
              src="https://m.media-amazon.com/images/I/71an9eiBxpL._SL1500_.jpg"
              alt=""
              className="w-[22vw] h-[22vw] hidden sm:block"
              loading="lazy"
            />
          </section>
        ))}
      </main>
    </section>
  );
};

export default Home;
