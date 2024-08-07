import { apiSlice } from "./apiSlice";
import { USER_URL } from "../constants";


export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (userData) => ({
                url: `${USER_URL}/register`,
                method: "POST",
                body: userData,
            })
        }),
        loginUser: builder.mutation({
            query: (userData) => ({
                url: `${USER_URL}/login`,
                method: "POST",
                body: userData,
            })
        }),

        logoutUser: builder.mutation({
            query: () => ({
                url: `${USER_URL}/logout`,
                method: "POST",
            })
        })
    })
})


export const {useLoginUserMutation, useLogoutUserMutation, useRegisterUserMutation} = authApiSlice