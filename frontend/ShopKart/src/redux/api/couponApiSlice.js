import { apiSlice } from "./apiSlice";

import { COUPON_URL } from "../constants";


export const couponApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addCoupon: builder.mutation({
            query: (couponData) => ({
                url: `${COUPON_URL}/create-coupon`,
                method: "POST",
                body: couponData
            })
        }),

        getCoupons: builder.query({
            query: () => `${COUPON_URL}/get-coupons`
        }),

        getCouponById: builder.query({
            query: (couponId) => ({
                url: `${COUPON_URL}/${couponId}`,
                method: "GET"
            })
        }),
        
        deleteCouponById: builder.mutation({
            query: (couponId) => ({
                url: `${COUPON_URL}/${couponId}`,
                method: "DELETE"
            })
        }),

        updateCouponById: builder.mutation({
            query: ({couponId, formData}) => ({
                url: `${COUPON_URL}/${couponId}`,
                method: "PUT",
                body: formData
            })
        })
    })
})

export const {useAddCouponMutation, useGetCouponsQuery, useDeleteCouponByIdMutation, useUpdateCouponByIdMutation, useGetCouponByIdQuery} = couponApiSlice