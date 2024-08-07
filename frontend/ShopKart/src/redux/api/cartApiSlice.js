import { apiSlice } from "./apiSlice";
import { CART_URL } from "../constants";


export const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        

        addToCartApi: builder.mutation({
            query: ({userId, productId, quantity=1}) => ({
                url: `${CART_URL}/add-to-cart`,
                method: "POST",
                body: {userId, productId, quantity}
            })
        }),

        removeFromCartApi: builder.mutation({
            query: ({userId, productId, quantity=1}) => ({
                url: `${CART_URL}/delete-product-from-cart`,
                method: "POST",
                body: {userId, productId, quantity}
            })
        }),

        deleteAProductFromCartApi: builder.mutation({
            query: ({userId, productId}) => ({
                url: `${CART_URL}/remove-one-product-from-cart`,
                method: "POST",
                body: {userId, productId}
            })
        }),

        getUserCartApi: builder.query({
            query: (userId) => ({
                url: `${CART_URL}/${userId}`,
                method: "GET",
            })
        }),

        clearCartApi: builder.mutation({
            query: ({userId, productId, quantity=1}) => ({
                url: `${CART_URL}/clear-cart`,
                method: "POST",
                body: {userId, productId, quantity}
            })
        })
    })
})


export const {useAddToCartApiMutation, useRemoveFromCartApiMutation, useClearCartApiMutation, useDeleteAProductFromCartApiMutation, useGetUserCartApiQuery} = cartApiSlice