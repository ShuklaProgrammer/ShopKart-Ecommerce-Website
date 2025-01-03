import { apiSlice } from "./apiSlice";
import { DISCOUNT_URL } from "../constants";

export const discountApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createDiscount: builder.mutation({
      query: (discountData) => ({
        url: `${DISCOUNT_URL}/create-discount`,
        method: "POST",
        body: discountData,
      }),
    }),

    updateDiscount: builder.mutation({
      query: ({ discountId, discountData }) => ({
        url: `${DISCOUNT_URL}/${discountId}`,
        method: "PUT",
        body: discountData,
      }),
    }),

    getDiscountById: builder.query({
      query: (discountId) => ({
        url: `${DISCOUNT_URL}/${discountId}`,
        method: "GET",
      }),
    }),

    getAllDiscounts: builder.query({
      query: () => `${DISCOUNT_URL}/get-discounts`,
    }),

    deleteDiscount: builder.mutation({
      query: (discountId) => ({
        url: `${DISCOUNT_URL}/${discountId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateDiscountMutation,
  useGetAllDiscountsQuery,
  useDeleteDiscountMutation,
  useGetDiscountByIdQuery,
  useUpdateDiscountMutation,
} = discountApiSlice;
