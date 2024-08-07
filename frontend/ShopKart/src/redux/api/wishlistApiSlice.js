import { apiSlice } from "./apiSlice";
import { WISHLIST_URL } from "../constants";


export const wishlistApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        addWishlist: builder.mutation({
            query: ({userId, productId}) => ({
                url: `${WISHLIST_URL}/add-product-to-wishlist`,
                method: "POST",
                body: {userId, productId}
            })
        }),

        removeOneProductFromWishlist: builder.mutation({
            query: ({userId, productId}) => ({
                url: `${WISHLIST_URL}/remove-one-product-from-wishlist`,
                method: "POST",
                body: {userId, productId}
            })
        }),

        getUserWishlist: builder.query({
            query: (userId) => ({
                url: `${WISHLIST_URL}/${userId}`,
                method: "GET",
            })
        })
    })
})

export const {useAddWishlistMutation, useRemoveOneProductFromWishlistMutation, useGetUserWishlistQuery} = wishlistApiSlice