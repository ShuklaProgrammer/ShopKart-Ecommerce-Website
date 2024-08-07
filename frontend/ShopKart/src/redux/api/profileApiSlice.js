import { apiSlice } from "./apiSlice";
import { PROFILE_URL } from "../constants";


export const profileApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        
        createProfile: builder.mutation({
            query: (profileData) => ({
                url: `${PROFILE_URL}/create-profile`,
                method: "POST",
                body: profileData
            })
        }),

        updateProfile: builder.mutation({
            query: (profileData) => ({
                url: `${PROFILE_URL}/update-profile`,
                method: "PUT",
                body: profileData
            })
        }),

        deleteUserProfile: builder.mutation({
            query: ({userId, addressId}) => ({
                url: `${PROFILE_URL}/delete-profile`,
                method: "DELETE",
                body: {userId, addressId}
            })
        }),

        getUserProfile: builder.query({
            query: () => ({
                url: `${PROFILE_URL}/get-user-profile`,
                method: "GET",
            })
        })
    })
})


export const {useCreateProfileMutation, useUpdateProfileMutation, useGetUserProfileQuery, useDeleteUserProfileMutation} = profileApiSlice