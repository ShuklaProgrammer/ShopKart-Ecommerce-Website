import { apiSlice } from "./apiSlice";
import { PRODUCT_URL } from "../constants";
import { REVIEW_URL } from "../constants";


export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({


        createProduct: builder.mutation({
            query: (productData) => ({
                url: `${PRODUCT_URL}/create-product`,
                method: "POST",
                body: productData,
            })
        }),

        updateProduct: builder.mutation({
            query: ({productId, formData}) => ({
                url: `${PRODUCT_URL}/${productId}`,
                method: "PUT",
                body: formData
            })
        }),

        getProductById: builder.query({
            query: (productId) => ({
                url: `${PRODUCT_URL}/${productId}`,
                method: "GET"
            })
        }),

        getAllProduct: builder.query({
            query: ({filterCategory, filterBrand, filterPrice, filterTags, sort, search, page, limit}) => {
                const query = new URLSearchParams()
                if(sort) query.append("sort", sort)
                if(search) query.append("search", search)  
                if(filterCategory) query.append("filterCategory", filterCategory) 
                if(filterBrand) query.append("filterBrand", filterBrand)    
                if(filterTags) query.append("filterTags", filterTags)
                if(filterPrice) query.append("filterPrice", filterPrice)
                if(page) query.append("page", page)  
                if(limit) query.append("limit", limit)      

                return{
                    url: `${PRODUCT_URL}/get-products?${query.toString()}`,
                    method: "GET"
                }
            }
        }),

        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCT_URL}/${productId}`,
                method: "DELETE"
            })
        }),

        addDiscountToAProduct: builder.mutation({
            query: ({productId, discountData}) => ({
                url: `${PRODUCT_URL}/${productId}/add-discount`,
                method: "POST",
                body: discountData
            })
        }),

        addProductReview: builder.mutation({
            query: ({reviewData}) => ({
                url: `${REVIEW_URL}/add-review`,
                method: "POST",
                body: reviewData
            })
        }),

        deleteUserReview: builder.mutation({
            query: ({userId, reviewId}) => ({
                url: `${REVIEW_URL}/delete-review-user/${userId}`,
                method: "DELETE",
                body: {reviewId}
            })
        }),

        topReviews: builder.query({
            query: () => ({
                url: `${REVIEW_URL}/get-top-review`,
                method: "GET"
            })
        })

    })
})

export const {useCreateProductMutation, useGetAllProductQuery, useUpdateProductMutation, useDeleteProductMutation, useGetProductByIdQuery, useAddDiscountToAProductMutation, useAddProductReviewMutation, useDeleteUserReviewMutation, useTopReviewsQuery} = productApiSlice
