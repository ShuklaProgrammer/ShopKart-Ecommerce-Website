import React, { useEffect, useState } from 'react'

import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, BarElement, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, ArcElement)

//all icons
import { BiShoppingBag } from "react-icons/bi";
import { FiDollarSign, FiUsers, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { AiOutlineShop } from 'react-icons/ai';
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { GoDotFill } from "react-icons/go";
import { useGetAllOrdersQuery, useGetOrderStatisticsQuery, useTopProductBySalesQuery, useTopStatesBySalesQuery } from '@/redux/api/orderApiSlice';

//shadcn
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useTopReviewsQuery } from '@/redux/api/productApiSlice';
import { FaStar } from 'react-icons/fa';



const Dashboard = () => {


  const { data: getOrderStatistics } = useGetOrderStatisticsQuery({})
  const {data: getAllOrders} = useGetAllOrdersQuery({})
  const {data: getTopStatesSales} = useTopStatesBySalesQuery()
  const {data: getTopProductBySales} = useTopProductBySalesQuery()
  const {data: getTopReviews} = useTopReviewsQuery({})

  const orders = getAllOrders?.data?.orders || []
  const orderStatistics = getOrderStatistics?.data || []

  const totalOrders = orderStatistics?.totalOrders || 0
  const totalIncome = orderStatistics?.totalIncome || 0
  const totalUsers = orderStatistics?.totalUsers || 0
  const salesByMonth = orderStatistics?.salesByMonth || 0

  const topStateSales = getTopStatesSales?.data || {}
  const topProducts = getTopProductBySales?.data || []
  const topReviews = getTopReviews?.data || []

  console.log(topReviews)
  

  const [salesData, setSalesData] = useState({
    labels: ["Orders"],
    datasets: [
      {
        data: [0],
        backgroundColor: "lightGreen",
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  });

  const [incomeData, setIncomeData] = useState({
    labels: ["Income"],
    datasets: [
      {
        data: [0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  });


  const [userData, setUserData] = useState({
    labels: ["Users"],
    datasets: [
      {
        data: [0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  });

  const [lineChartData, setLineChartData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales",
        data: new Array(12).fill(0),
        borderColor: "blue",
        borderWidth: 2,
        tension: 0.4,
        fill: false
      }
    ]
  })

  const [barChartData, setBarChartData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Revenue",
        data: [0],
        backgroundColor: "blue",
        borderColor: "blue",
        borderWidth: 1
      },
    ]
  })

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide vertical grid lines
        },
      },
      y: {
        grid: {
          display: true, // Show horizontal grid lines
        },
        border: {
          display: false
        }
      },
    },
  }

  const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  useEffect(() => {
    if(orderStatistics){
      setSalesData({
        labels: ["Sales"],
        datasets: [{data: [totalOrders], backgroundColor: "lightGreen"}]
      });

      setIncomeData({
        labels: ["Income"],
        datasets: [{data: [totalIncome], backgroundColor: "#FF6384"}]
      });

      setUserData({
        labels: ["Users"],
        datasets: [{data: [totalUsers], backgroundColor: "#36A2EB"}]
      });

      const salesData = Array.isArray(salesByMonth) ? salesByMonth : []

      setLineChartData({
        labels: salesData.map(month => `${monthName[month._id.month - 1]}`),
        datasets: [{
          label: "Sales",
          data: salesData.map(month => month.numberOfSales),
          borderColor: "blue",
          borderWidth: 2,
          tension: 0.4,
          fill: false
        }]
      })

      setBarChartData({
        labels: salesData.map(month => `${monthName[month._id.month - 1]}`),
        datasets:[{
          label: "Revenue",
          data: salesData.map(month => month.totalSalesAmount),
          backgroundColor: "blue",
          borderColor: "blue",
          borderWidth: 1
        }]
      })
    }

    
  }, [orderStatistics])

  const getStars = (count) => {
    let stars = []
    for (let i = 0; i < count; i++) {
      stars.push(<FaStar className='text-orange-400' key={i}/>)
    }
    return stars
  } 


  //up and down trending calculation
  const calculatePercentageChange = (previousValue, currentValue) => {
    if (previousValue === 0) return 0;
    return ((currentValue - previousValue) / previousValue) * 100;
  };
  
  const determineTrend = (percentageChange) => {
    return percentageChange > 0 ? 'up' : 'down';
  };

   // Example previous values (these should be fetched from historical data or set as needed)
   const previousTotalOrders = 500; // Example value
   const previousTotalIncome = 10000; // Example value
   const previousTotalUsers = 300;
 
   // Calculate percentage changes
   const orderPercentageChange = calculatePercentageChange(previousTotalOrders, totalOrders);
   const incomePercentageChange = calculatePercentageChange(previousTotalIncome, totalIncome);
   const userPercentageChange = calculatePercentageChange(previousTotalUsers, totalUsers);
 
   // Determine trends
   const orderTrend = determineTrend(orderPercentageChange);
   const incomeTrend = determineTrend(incomePercentageChange);
   const userTrend = determineTrend(userPercentageChange);


  return (
    <section className='w-full'>
      <main className='w-[90%] space-y-6'>
        <div className='flex justify-between gap-2'>
          <div className='flex items-center gap-2 p-4 border border-1 border-gray-300 '>
            <div className='bg-green-500 p-3 rounded-full'>
              <BiShoppingBag className='text-3xl text-white' />
            </div>
            <div>
              <h3>Total Orders</h3>
              <span className='text-2xl font-semibold'>{totalOrders}</span>
            </div>
            <div className='flex items-center gap-2'>
            {orderTrend === 'up' ? <FiTrendingUp className='text-xl text-green-500' /> : <FiTrendingDown className='text-xl text-red-500' />}
            <span>{orderPercentageChange.toFixed(2)}%</span>
            </div>
            <div className='w-20'>
              <Doughnut data={salesData} options={{plugins: {legend: {display: false}}}}/>
              </div>
          </div>
          <div className='flex items-center gap-2 p-4 border border-1 border-gray-300'>
            <div className='bg-orange-600 p-3 rounded-full'>
              <FiDollarSign className='text-3xl text-white' />
            </div>
            <div>
              <h3>Total Income</h3>
              <span className='text-2xl font-semibold'>${totalIncome}</span>
            </div>
            <div className='flex items-center gap-2'>
            {incomeTrend === 'up' ? <FiTrendingUp className='text-xl text-green-500' /> : <FiTrendingDown className='text-xl text-red-500' />}
            <span>{incomePercentageChange.toFixed(2)}%</span>
            </div>
            <div className='w-20'>
              <Doughnut data={incomeData} options={{plugins: {legend: {display: false}}}}/>
              </div>
          </div>
          {/* <div className='flex items-center gap-3 p-4 border border-1 border-gray-300'>
            <div className='bg-gray-400 p-3 rounded-full'>
              <AiOutlineShop className='text-3xl text-white' />
            </div>
            <div>
              <h3>Orders Paid</h3>
              <span className='text-2xl font-semibold'>$34,945</span>
            </div>
            <div className='flex items-center gap-2'>
              <FiTrendingUp />
              <span>1.56%</span>
            </div>
          </div> */}
          <div className='flex items-center gap-2 p-4 border border-1 border-gray-300'>
            <div className='bg-blue-500 p-3 rounded-full'>
              <FiUsers className='text-3xl text-white' />
            </div>
            <div>
              <h3>Total User</h3>
              <span className='text-2xl font-semibold'>{totalUsers}</span>
            </div>
            <div className='flex items-center gap-2'>
            {userTrend === 'up' ? <FiTrendingUp className='text-xl text-green-500' /> : <FiTrendingDown className='text-xl text-red-500' />}
            <span>{userPercentageChange.toFixed(2)}%</span>
            </div>
            <div className='w-20'>
              <Doughnut data={userData} options={{plugins: {legend: {display: false}}}}/>
              </div>
          </div>
        </div>

        <section className='flex justify-between gap-6'>
          <div className='w-full p-4 border border-1 border-gray-300'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold'>Recent Order</h2>
              <PiDotsThreeOutlineFill className='text-2xl' />
            </div>
            <div className='mt-4'>
              <Line data={lineChartData} options={options} />
            </div>
          </div>

          <div className='w-full p-4 border border-1 border-gray-300'>
            <h2 className='text-xl font-semibold'>Top Products</h2>
            <Table className="mt-4">
              <TableCaption>A list of your recent products.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Product</TableHead>
                  <TableHead>Sold</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <img src={product.productImage} alt="" className='w-10 h-10' />
                    <p className='line-clamp-1'>{product.productName}</p>
                  </TableCell>
                  <TableCell>{product.productQuantitySold}</TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>

          </div>

        </section>

        <section className='flex justify-between gap-6'>
        <div className='w-full p-4 border border-1 border-gray-300'>
            <h2 className='text-xl font-semibold'>Top States By Sales</h2>
            <div className='flex items-center gap-2 mt-4'>
              <span className='text-xl'>${topStateSales.totalSales}</span>
              <FiTrendingUp />
              <span>1.56%</span>
              <p>since last month</p>
            </div>
            <Table className="mt-4">
              <TableCaption>A list of your recent states.</TableCaption>
              <TableBody>
                {topStateSales.states?.map((state, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{state.state}</TableCell>
                  <TableCell><FiTrendingUp /></TableCell>
                  <TableCell>{state.numberOfSales}</TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className='w-full p-4 border border-1 border-gray-300'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold'>Orders</h2>
              <PiDotsThreeOutlineFill className='text-2xl'/>
            </div>
            <Table className="mt-4">
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Product</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                        {orders.map((order, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">
                                    {order.orderItems?.slice(0, 1).map((item, index) => (
                                        <div key={index} className='flex items-center gap-2'>
                                            <img src={item.productImage} alt="" className='w-10 h-10' />
                                            <p className='w-72 whitespace-nowrap overflow-hidden overflow-ellipsis'>{item.productName}</p>
                                        </div>
                                    ))}
                                </TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
            </Table>

          </div>
        </section>

        <section className='flex justify-between gap-6'>
        <div className='w-full p-4 border border-1 border-gray-300'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold'>Earnings</h2>
              <PiDotsThreeOutlineFill className='text-2xl'/>
            </div>
            <div className='flex items-center mt-4'>
              <GoDotFill className='text-blue-800'/>
              <p>Revenue</p>
            </div>
            <div className='flex items-center gap-2'>
              {}
              <span className='text-2xl font-semibold'>${totalIncome}</span>
              <FiTrendingUp />
              <span>1.56%</span>
            </div>

            <div className='mt-4'>
              <Bar data={barChartData} options={options} />
            </div>
          </div>

          <div className='w-full p-4 border border-1 border-gray-300'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold'>New Comments</h2>
              <PiDotsThreeOutlineFill className='text-2xl'/>
            </div>
            <div className='flex flex-col gap-2 mt-4'>
              {topReviews.map((review, index) => (
              <div key={index} className='flex items-start gap-2'>
              <img src="" alt="" className='w-10 h-10 rounded-full' />
              <div>
                <h3>{review.username}</h3>
                <span className='flex'>{getStars(review.rating)}</span>
                <p className='text-sm'>{review.comment}</p>
              </div>
                </div>
                ))}
            </div>
          </div>
        </section>
      </main>
    </section>
  )
}

export default Dashboard