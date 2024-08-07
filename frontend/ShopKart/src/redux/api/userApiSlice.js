import { USER_URL } from "../constants";

import { apiSlice } from "./apiSlice";


export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getAllUsers: builder.query({
            query: () => `${USER_URL}/get-users`
        }),

        changeUserRole: builder.mutation({
            query: ({userId, role}) => ({
                url: `${USER_URL}/${userId}/change-role`,
                method: "POST",
                body: {userId, role}
            })
        })
    })
})

export const {useGetAllUsersQuery, useChangeUserRoleMutation} = userApiSlice