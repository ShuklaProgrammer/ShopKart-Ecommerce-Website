import { Button } from '@/components/ui/button'
import React from 'react'

// all the icons are imported here
import { IoMdArrowForward } from "react-icons/io";
import { BsBoxSeam } from "react-icons/bs";
import { CiTrophy } from "react-icons/ci";
import { GoCreditCard } from "react-icons/go";
import { CiHeadphones } from "react-icons/ci";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";

import { useGetAllProductQuery } from '@/redux/api/productApiSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useGetAllCategoryQuery } from '@/redux/api/categoryApiSlice';




const Home = () => {

  const navigate = useNavigate()

  const {data: productData} = useGetAllProductQuery({})
  const {data: categoryData} = useGetAllCategoryQuery({})

  const products = productData?.data?.products || []
  const categories = categoryData?.data || []

  // console.log(products)

  const handleCategoryClick = (categoryName) => {
    navigate(`/shop?category=${categoryName}`)
  }

  return (
    <section className='home-section flex justify-center mt-5'>
      <main className='bg-white w-[90%] h-full'>

         
        <section className='sm:flex gap-5'>
        {products?.slice(0, 1).map((product, index) => (  
          <div key={index} className='container1 flex justify-center items-center py-4 sm:py-0 px-4 sm:px-0 w-full gap-10 bg-gray-100 rounded-md'> 
            <div className='w-[20rem] space-y-4'>
              <span className='uppercase font-medium text-blue-400'>――The Real World Experience</span>
              <h1 className='text-2xl font-bold'>{product.title}</h1>
              <div className='w-56 bg-red-300 block sm:hidden'>
              <img src={product.productImage[0]} alt="" className='' />
            </div>
              <p className='text-gray-500'>Save big on your next holiday on Smart TV. Get 2 months Subscription for Netflix, Prime Video, Youtube.</p>
              <Link key={index} to={`/product-details/${product._id}`}>
              <Button variant="shop">Shop Now<IoMdArrowForward className='text-white text-xl ml-2' /></Button>
              </Link>
            </div>
            <div className='w-56 bg-red-300 hidden sm:block'>
              <img src={product.productImage[0]} alt="" className='' />
            </div>  
          </div>
        ))} 
          <div className='container2 flex flex-col sm:w-[60%] sm:mt-0 mt-4 gap-5'>
          {products?.slice(1, 2).map((product, index) => (  
            <div key={index} className='flex items-center justify-between sm:px-8 px-4 py-4 sm:py-0 bg-gray-800 rounded-md'>
              <div className='space-y-3'>
                <span className='uppercase text-yellow-400'>Summer Sales</span>
                <div className='w-56 sm:hidden block'>
                <img src={product.productImage[0]} alt="" />
              </div>
                <h2 className='text-xl font-semibold text-white'>{product.title}</h2>
              <Link key={index} to={`/product-details/${product._id}`}>
                <Button variant="shop">Shop Now<IoMdArrowForward className='text-xl ml-2' /></Button>
                </Link>
              </div>
              <div className='w-56 hidden sm:block'>
                <img src={product.productImage[0]} alt="" />
              </div>
            </div>
          ))}
            {products?.slice(2, 3).map((product, index) => (  
            <div key={index} className='sm:flex items-center justify-between sm:px-8 px-4 py-4 sm:py-0 bg-yellow-200 rounded-md'>
              <div className='w-56'>
                <img src={product.productImage[0]} alt="" />
              </div>
              <div className='sm:flex flex flex-col items-start justify-start space-y-3'>
                <h2 className='text-xl font-semibold'>{product.title}</h2>
                <span className='uppercase font-semibold'>${product.price}</span>
                <Link key={index} to={`/product-details/${product._id}`}>
                <Button variant="shop">Shop Now<IoMdArrowForward className='text-xl ml-2' /></Button>
                </Link>
              </div>
            </div>
               ))}
          </div>
        </section>


        <section className='grid grid-rows-1 sm:flex sm:justify-between sm:px-10 sm:py-5 border-2 border-solid border-gray-200 mt-5'>
          <div className='p-2 sm:p-0 sm:flex items-center gap-3 flex'>
            <BsBoxSeam className='text-2xl text-gray-700' />
            <div className=''>
              <h3 className='text-sm font-semibold text-gray-700'>Fasted Delievry</h3>
              <p className='text-xs text-gray-500'>Delivery in 24/H</p>
            </div>
          </div>

          {/* a vertical line */}
          <div className='sm:border border-gray-300'></div>

          <div className='p-2 sm:p-0 sm:flex items-center gap-3 flex'>
            <CiTrophy className='text-3xl text-gray-700' />
            <div>
              <h3 className='text-sm font-semibold text-gray-700'>24 Hours Return</h3>
              <p className='text-xs text-gray-500'>100% money-back guarantee</p>
            </div>
          </div>

          {/* a vertical line */}
          <div className='sm:border border-gray-300'></div>

          <div className='p-2 sm:p-0 sm:flex items-center gap-3 flex'>
            <GoCreditCard className='text-2xl text-gray-700' />
            <div>
              <h3 className='text-sm font-semibold text-gray-700'>Secure Payment</h3>
              <p className='text-xs text-gray-500'>Your money is safe</p>
            </div>
          </div>

          {/* a vertical line */}
          <div className='sm:border border-gray-300'></div>

          <div className='p-2 sm:p-0 sm:flex items-center gap-3 flex'>
            <CiHeadphones className='text-3xl text-gray-700' />
            <div>
              <h3 className='text-sm font-semibold text-gray-700'>Support 24/7</h3>
              <p className='text-xs text-gray-500'>Live contact/message</p>
            </div>
          </div>
        </section>

        <section className='mt-10'>
          <div className='sm:flex sm:items-center sm:gap-5'>
            <h1 className='text-2xl font-semibold'>Best Deals</h1>
            <p>Deals ends in:</p>
            <span className='font-medium text-black bg-yellow-400 rounded px-2 py-1'>16d:21h:57m:23s</span>
          </div>

          <div className='border-2 border-gray-200 mt-5'>

            <div className='grid grid-cols-1 sm:grid-cols-5 divide-x-2 divide-y-2 divide-gray-200'>

              {/* <div className='row-span-2 border-r-2 py-12'>
                <div className='flex justify-center'>
                  <img src="" alt="" className='w-[15vw] h-[15vw] mt-5 mb-3' />
                </div>
                <span className='px-4'>stars</span>
                <p className='w-22 text-sm px-4 mb-2'>Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...</p>
                <span className='pl-4'>$2000</span>
                <p className='w-22 text-xs px-4 mb-2'>DISPLAY - 16.39 Centimeters (6.5"Inch) Super AMOLED Display with 19.5:9 Aspect Ratio, FHD+ Resolution with 1080 x 2340 Pixels , 399 PPI with 16M Colors and 90Hz Refresh Rate</p>
                <div className='flex items-center gap-2 mt-5'>
                  <div className='bg-orange-200 p-2 rounded-sm hover:bg-orange-300 hover:cursor-pointer'>
                    <FaRegHeart className='text-2xl' />
                  </div>
                  <Button variant="cart" className="flex items-center gap-2"><FiShoppingCart className='text-xl' />Add to Cart</Button>
                  <div className='bg-orange-200 p-2 rounded-sm hover:bg-orange-300 hover:cursor-pointer'>
                    <FaRegEye className='text-2xl' />
                  </div>
                </div>
              </div> */}

              {products.slice(3, 50).map((product, index) => (
                <Link key={index} to={`/product-details/${product._id}`}>
              <div className='col-span-1 border-r-2'>
                <div className='flex justify-center'>
                  <img src={product.productImage[0]} alt="" className='w-56 h-56 mt-5 mb-3' />
                </div>
                <p className='line-clamp-2 leading-tight text-sm px-4 mb-2'>{product.title}</p>
                <span className='pl-4'>${product.price}</span>
              </div>
              </Link>
              ))}

              <div className='col-span-1 border-r-2'>
                <div className='flex justify-center'>
                  <img src="" alt="" className='w-56 h-56 mt-5 mb-3' />
                </div>
                <p className='w-22 text-sm px-4 mb-2'>Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...</p>
                <span className='pl-4'>$2000</span>
              </div>

              <div className='col-span-1 border-r-2'>
                <div className='flex justify-center'>
                  <img src="" alt="" className='w-56 h-56 mt-5 mb-3' />
                </div>
                <p className='w-22 text-sm px-4 mb-2'>Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...</p>
                <span className='pl-4'>$2000</span>
              </div>

              <div className='col-span-1 border-r-2'>
                <div className='flex justify-center'>
                  <img src="" alt="" className='w-56 h-56 mt-5 mb-3' />
                </div>
                <p className='w-22 text-sm px-4 mb-2'>Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...</p>
                <span className='pl-4'>$2000</span>
              </div>

              <div className='col-span-1 border-r-2'>
                <div className='flex justify-center'>
                  <img src="" alt="" className='w-56 h-56 mt-5 mb-3' />
                </div>
                <p className='w-22 text-sm px-4 mb-2'>Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...</p>
                <span className='pl-4'>$2000</span>
              </div>

              <div className='col-span-1 border-r-2'>
                <div className='flex justify-center'>
                  <img src="" alt="" className='w-56 h-56 mt-5 mb-3' />
                </div>
                <p className='w-22 text-sm px-4 mb-2'>Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...</p>
                <span className='pl-4'>$2000</span>
              </div>

              <div className='col-span-1 border-r-2'>
                <div className='flex justify-center'>
                  <img src="" alt="" className='w-56 h-56 mt-5 mb-3' />
                </div>
                <p className='w-22 text-sm px-4 mb-2'>Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...</p>
                <span className='pl-4'>$2000</span>
              </div>

              <div className='col-span-1 border-r-2'>
                <div className='flex justify-center'>
                  <img src="" alt="" className='w-56 h-56 mt-5 mb-3' />
                </div>
                <p className='w-22 text-sm px-4 mb-2'>Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...</p>
                <span className='pl-4'>$2000</span>
              </div>

              <div className='col-span-1 border-r-2'>
                <div className='flex justify-center'>
                  <img src="" alt="" className='w-56 h-56 mt-5 mb-3' />
                </div>
                <p className='w-22 text-sm px-4 mb-2'>Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...</p>
                <span className='pl-4'>$2000</span>
              </div>

            </div>
          </div>
        </section>

         {/* banner section */}
         <section className='sm:flex space-y-4 sm:space-y-0 justify-between gap-5 sm:mt-20 mt-4'>
          <div className='flex bg-gray-300 p-5 items-center gap-5'>
            <div className='space-y-2'>
              <span className='uppercase bg-sky-400 text-white px-2 py-1 rounded'>Introducing</span>
              <h2 className='text-2xl font-semibold'>New Apple Homepod Mini</h2>
            <img src="https://m.media-amazon.com/images/I/6182GmVZGLL._SL1080_.jpg" alt="" className='w-56 h-56 block sm:hidden' />
              <p>Jam-packed with innovation, HomePod mini delivers unexpectedly.</p>
              <Button variant="shop">Shop Now<IoMdArrowForward className='text-white text-xl ml-2' /></Button>
            </div>
            <img src="https://m.media-amazon.com/images/I/6182GmVZGLL._SL1080_.jpg" alt="" className='w-56 h-56 hidden sm:block' />
          </div>
          <div className='flex bg-gray-800 p-5 items-center gap-5'>
            <div className='space-y-2'>
              <span className='uppercase bg-yellow-300 py-1 px-2 rounded'>Introducing New</span>
              <h2 className='text-2xl font-semibold text-white'>Xiaomi Mi 11 Ultra 12GB+256GB</h2>
            <img src="https://m.media-amazon.com/images/I/819sWoSDFRL._SL1500_.jpg" alt="" className='w-56 h-56 block sm:hidden' />
              <p className='text-gray-400'>*Data provided by internal laboratories. Industry measurment.</p>
              <Button variant="shop">Shop Now<IoMdArrowForward className='text-white text-xl ml-2' /></Button>
            </div>
            <img src="https://m.media-amazon.com/images/I/819sWoSDFRL._SL1500_.jpg" alt="" className='w-56 h-56 hidden sm:block' />
          </div>
        </section>

        <section>
          <h1 className='flex justify-center sm:mt-12 mt-4 sm:mb-10 mb-4 text-2xl font-semibold'>Shop with Categorys</h1>

          <div className='border-1 flex justify-between gap-5 overflow-x-scroll overflow-hidden'>
            {categories.map((category, index) => (
            <div onClick={() => handleCategoryClick(category.categoryName)} key={index} className='border-2 px-5'>
              <div className='flex justify-center'>
                <img src="" alt="" className='w-[15vw] h-[15vw] mt-5 mb-2' />
              </div>
              <span className='flex justify-center font-semibold'>{category.categoryName}</span>
            </div>
            ))}
          </div>


          <div className='border-2 border border-solid border-gray-200 border mt-10'>

            <div className='grid grid-cols-1 sm:grid-cols-5 divide-x-2 divide-y-2 divide-gray-200'>

              <div className='col-span-1'>
                <div className='flex justify-center'>
                  <img src="" alt="" className='w-56 h-56 mt-5 mb-3' />
                </div>
                <p className='w-22 text-sm px-4 mb-2'>Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...</p>
                <span className='pl-4'>$2000</span>
              </div>

              <div className='col-span-1'>
                <div className='flex justify-center'>
                  <img src="" alt="" className='w-56 h-56 mt-5 mb-3' />
                </div>
                <p className='w-22 text-sm px-4 mb-2'>Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...</p>
                <span className='pl-4'>$2000</span>
              </div>

              <div className='col-span-1'>
                <div className='flex justify-center'>
                  <img src="" alt="" className='w-56 h-56 mt-5 mb-3' />
                </div>
                <p className='w-22 text-sm px-4 mb-2'>Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...</p>
                <span className='pl-4'>$2000</span>
              </div>

              <div className='col-span-1'>
                <div className='flex justify-center'>
                  <img src="" alt="" className='w-56 h-56 mt-5 mb-3' />
                </div>
                <p className='w-22 text-sm px-4 mb-2'>Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...</p>
                <span className='pl-4'>$2000</span>
              </div>

              <div className='col-span-1'>
                <div className='flex justify-center'>
                  <img src="" alt="" className='w-56 h-56 mt-5 mb-3' />
                </div>
                <p className='w-22 text-sm px-4 mb-2'>Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...</p>
                <span className='pl-4'>$2000</span>
              </div>

              <div className='col-span-1'>
                <div className='flex justify-center'>
                  <img src="" alt="" className='w-56 h-56 mt-5 mb-3' />
                </div>
                <p className='w-22 text-sm px-4 mb-2'>Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...</p>
                <span className='pl-4'>$2000</span>
              </div>

              <div className='col-span-1'>
                <div className='flex justify-center'>
                  <img src="" alt="" className='w-56 h-56 mt-5 mb-3' />
                </div>
                <p className='w-22 text-sm px-4 mb-2'>Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...</p>
                <span className='pl-4'>$2000</span>
              </div>

              <div className='col-span-1'>
                <div className='flex justify-center'>
                  <img src="" alt="" className='w-56 h-56 mt-5 mb-3' />
                </div>
                <p className='w-22 text-sm px-4 mb-2'>Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...</p>
                <span className='pl-4'>$2000</span>
              </div>

              <div className='col-span-1'>
                <div className='flex justify-center'>
                  <img src="" alt="" className='w-56 h-56 mt-5 mb-3' />
                </div>
                <p className='w-22 text-sm px-4 mb-2'>Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...</p>
                <span className='pl-4'>$2000</span>
              </div>

              <div className='col-span-1'>
                <div className='flex justify-center'>
                  <img src="" alt="" className='w-56 h-56 mt-5 mb-3' />
                </div>
                <p className='w-22 text-sm px-4 mb-2'>Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...</p>
                <span className='pl-4'>$2000</span>
              </div>

            </div>
          </div>
          

        </section>


        <section className='flex justify-between items-center sm:px-20 px-4 py-4 sm:py-0 bg-orange-200 mt-10 rounded-sm mb-10'>
          <div className='space-y-3'>
            <span className='bg-blue-400 rounded-sm px-2 py-1 text-white'>SAVE UP TO $200.00</span>
            <h1 className='text-3xl font-semibold'>Macbook Pro</h1>
          <img src="https://m.media-amazon.com/images/I/71an9eiBxpL._SL1500_.jpg" alt="" className='w-56 h-56 sm:hidden block' />
            <p className='w-[15rem]'>Apple M1 Max Chip. 32GB Unified Memory, 1TB SSD Storage</p>
            <Button variant="shop">Shop Now<IoMdArrowForward/></Button>
          </div>

          <img src="https://m.media-amazon.com/images/I/71an9eiBxpL._SL1500_.jpg" alt="" className='w-[22vw] h-[22vw] hidden sm:block' />
        </section>
      </main>
    </section>
  )
}

export default Home