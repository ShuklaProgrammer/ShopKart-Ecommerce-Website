import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/User/Home'
import Layout from "./components/mycomponents/Layout"
import ShopPage from './pages/User/ShopPage'
import ProductDetails from './pages/User/ProductDetails'
import TrackOrder from './pages/User/TrackOrder'
import Wishlist from './pages/Wishlist'
import ShoppingCart from './pages/ShoppingCart'
import Auth from './pages/Auth/Auth'
import PrivateRoute from './components/mycomponents/PrivateRoute'
import AdminRoute from './pages/Admin/AdminRoute'
import Dashboard from './pages/Admin/Dashboard'
import AddProduct from './pages/Admin/AddProduct'
import AllProduct from './pages/Admin/AllProduct'
import AddCategory from './pages/Admin/AddCategory'
import Brand from './pages/Admin/Brand'
// import Color from './pages/Admin/Color'
import Users from './pages/Admin/Users'
import UpdateProduct from './pages/Admin/UpdateProduct'
import AddDiscount from './pages/Admin/AddDiscount'
import AllDiscount from './pages/Admin/AllDiscount'
import UpdateDiscount from './pages/Admin/UpdateDiscount'
import Profile from './pages/Auth/Profile'
import AddCoupon from './pages/Admin/AddCoupon'
import AllCoupon from './pages/Admin/AllCoupon'
import UpdateCoupon from './pages/Admin/UpdateCoupon'
import OrderSuccessful from './pages/Order/OrderSuccessful'
import OrderPage from './pages/Order/OrderPage'
import ProfileLayout from './pages/Auth/ProfileLayout'
import ProfileDashboard from './pages/Auth/ProfileDashboard'
import ProfileSetting from './pages/Auth/ProfileSetting'
import ProfileAddress from './pages/Auth/ProfileAddress'
import ProfileOrders from './pages/Auth/ProfileOrders'
import ProfileOrderDetails from './pages/Auth/ProfileOrderDetails'
import TrackOrderDetails from './pages/Order/TrackOrderDetails'
import AllOrder from './pages/Admin/AllOrder'
import OrderDetails from './pages/Admin/OrderDetails'
import ErrorPage from './pages/ErrorPage'
import ForgetPassword from './pages/Auth/ForgetPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import EmailVerification from './pages/Auth/EmailVerification'
import MobileVerification from './pages/Auth/MobileVerification'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Routes for unregistered user */}
        <Route path='/' element={<Layout />}>
          <Route index={true} element={<Home />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='/shop' element={<ShopPage />} />
          <Route path='/product-details/:productId' element={<ProductDetails />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path='/cart' element={<ShoppingCart />} />

          <Route path='/forget-password' element={<ForgetPassword/>}/>


          {/* For Resgistered user */}
          <Route path='/' element={<PrivateRoute />}>
            <Route path='profile' element={<ProfileLayout />}>
              <Route path='dashboard' element={<ProfileDashboard />} />
              <Route path='address' element={<ProfileAddress />} />
              <Route path='orders' element={<ProfileOrders />} />
              <Route path='order-details' element={<ProfileOrderDetails />} />
              <Route path='setting' element={<ProfileSetting />} />
            </Route>
            <Route path='order' element={<OrderPage />} />
            <Route path='order-successful' element={<OrderSuccessful />} />
            <Route path='track-order' element={<TrackOrder />} />
            <Route path='track-order-details' element={<TrackOrderDetails />} />
            <Route path='reset-password' element={<ResetPassword/>} />
            <Route path='verify-email' element={<EmailVerification/>} />
            <Route path='verify-phone' element={<MobileVerification/>} />
            <Route />
          </Route>

          {/* for the admin */}
          <Route path='/admin' element={<AdminRoute />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='add-product' element={<AddProduct />} />
            <Route path='products' element={<AllProduct />} />
            <Route path='add-category' element={<AddCategory />} />
            <Route path='add-brand' element={<Brand />} />
            {/* <Route path="add-color" element={<Color/>}/> */}
            <Route path='orders' element={<AllOrder />} />
            <Route path='order-details' element={<OrderDetails />} />
            <Route path="users" element={<Users />} />
            <Route path="update-product/:productId" element={<UpdateProduct />} />
            <Route path=':productId?/add-discount' element={<AddDiscount />} />
            <Route path='discounts' element={<AllDiscount />} />
            <Route path='update-discount/:discountId' element={<UpdateDiscount />} />
            <Route path="add-coupon" element={<AddCoupon />} />
            <Route path="coupons" element={<AllCoupon />} />
            <Route path='update-coupon/:couponId' element={<UpdateCoupon />} />
          </Route>

        <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>

    // we will use this route to handle 404 error
  )
}

export default App