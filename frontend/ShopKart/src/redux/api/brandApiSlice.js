import { apiSlice } from "./apiSlice";

import { BRAND_URL } from "../constants";


export const brandApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllBrands: builder.query({
            query: () => `${BRAND_URL}/get-brands`
        }),

        createBrand: builder.mutation({
            query: (brandData) => ({
                url: `${BRAND_URL}/create-brand`,
                method: "POST",
                body: brandData
            })
        }),

        deleteBrand: builder.mutation({
            query: (brandId) => ({
                url: `${BRAND_URL}/${brandId}`,
                method: "DELETE",
            })
        }),

        updateBrand: builder.mutation({
            query: ({brandId, brandName}) => ({
                url: `${BRAND_URL}/${brandId}`,
                method: "PUT",
                body: {brandName}
            })
        })
    })
})

export const {useGetAllBrandsQuery, useCreateBrandMutation, useDeleteBrandMutation, useUpdateBrandMutation} = brandApiSlice