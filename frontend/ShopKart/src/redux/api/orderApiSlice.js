import { apiSlice } from "./apiSlice";
import { ORDER_URL } from "../constants";
import { PAYMENT_URL } from "../constants";

const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: `${ORDER_URL}/create-order`,
        method: "POST",
        body: orderData,
      }),
    }),

    updateOrderById: builder.mutation({
      query: ({ orderId, orderStatus }) => ({
        url: `${ORDER_URL}/update-order/${orderId}`,
        method: "PUT",
        body: { orderStatus },
      }),
    }),

    trackOrder: builder.mutation({
      query: ({ trackOrderData }) => ({
        url: `${ORDER_URL}/track-order`,
        method: "POST",
        body: trackOrderData,
      }),
    }),

    getAllOrders: builder.query({
      query: ({ page, limit, search }) => ({
        url: `${ORDER_URL}/get-orders`,
        method: "GET",
        params: { page, limit, search },
      }),
    }),

    getOrderById: builder.query({
      query: (orderId) => ({
        url: `${ORDER_URL}/get-order-by-id/${orderId}`,
        method: "GET",
      }),
    }),

    deleteOrderById: builder.mutation({
      query: (orderId) => ({
        url: `${ORDER_URL}/delete-order/${orderId}`,
        method: "DELETE",
      }),
    }),

    getUserOrder: builder.query({
      query: ({ orderId }) => ({
        url: `${ORDER_URL}/get-user-order`,
        method: "GET",
        params: { orderId },
      }),
    }),

    getAllUserOrders: builder.query({
      query: ({ page, limit }) => ({
        url: `${ORDER_URL}/get-all-user-orders`,
        method: "GET",
        params: { page, limit },
      }),
    }),

    getUserOrderStatistics: builder.query({
      query: () => ({
        url: `${ORDER_URL}/get-user-order-statistics`,
        method: "GET",
      }),
    }),

    getOrderStatistics: builder.query({
      query: () => ({
        url: `${ORDER_URL}/get-order-statistics`,
        method: "GET",
      }),
    }),

    addPayment: builder.mutation({
      query: (paymentData) => ({
        url: `${PAYMENT_URL}/create-payment`,
        method: "POST",
        body: paymentData,
      }),
    }),

    verifyPayment: builder.mutation({
      query: (paymentOrder) => ({
        url: `${PAYMENT_URL}/verify-payment`,
        method: "POST",
        body: paymentOrder,
      }),
    }),

    topStatesBySales: builder.query({
      query: () => ({
        url: `${ORDER_URL}/get-top-states-sales`,
        method: "GET",
      }),
    }),

    topProductBySales: builder.query({
      query: () => ({
        url: `${ORDER_URL}/top-products-sales`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useUpdateOrderByIdMutation,
  useTrackOrderMutation,
  useGetAllOrdersQuery,
  useDeleteOrderByIdMutation,
  useGetOrderByIdQuery,
  useGetUserOrderQuery,
  useAddPaymentMutation,
  useVerifyPaymentMutation,
  useGetUserOrderStatisticsQuery,
  useGetOrderStatisticsQuery,
  useGetAllUserOrdersQuery,
  useTopStatesBySalesQuery,
  useTopProductBySalesQuery,
} = orderApiSlice;
