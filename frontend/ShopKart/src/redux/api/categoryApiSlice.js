import { apiSlice } from "./apiSlice";

import { CATEGORY_URL } from "../constants";

export const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getAllCategory: builder.query({
            query: () => `${CATEGORY_URL}/get-categories`
        }),

        createCategory: builder.mutation({
            query: (categoryData) => ({
                url: `${CATEGORY_URL}/create-category`,
                method: "POST",
                body: categoryData
            })
        }),

        deleteCategory: builder.mutation({
            query: (categoryId) => ({
                url: `${CATEGORY_URL}/${categoryId}`,
                method: "DELETE",
            })
        }),

        getCategoryById: builder.query({
            query: (categoryId) => ({
                url: `${CATEGORY_URL}/${categoryId}`,
                method: "GET"
            })
        }),

        updateCategory: builder.mutation({
            query: ({ categoryId, categoryName }) => ({
                url: `${CATEGORY_URL}/${categoryId}`,
                method: "PUT",
                body: {categoryName}
            })
        })
    })
})

export const {useGetAllCategoryQuery, useCreateCategoryMutation, useDeleteCategoryMutation, useGetCategoryByIdQuery, useUpdateCategoryMutation} = categoryApiSlice