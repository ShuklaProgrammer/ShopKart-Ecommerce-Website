import { apiSlice } from "./apiSlice";

import { COLOR_URL } from "../constants";


export const colorApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getAllColors: builder.query({
            query: () => `${COLOR_URL}/get-colors`
        }),

        createColor: builder.mutation({
            query: (colorData) => ({
                url: `${COLOR_URL}/create-color`,
                method: "POST",
                body: colorData
            })
        }),

        updateColor: builder.mutation({
            query: ({colorId, colorName}) => ({
                url: `${COLOR_URL}/${colorId}`,
                method: "PUT",
                body: {colorName}
            })
        }),

        deleteColor: builder.mutation({
            query: (colorId) => ({
                url: `${COLOR_URL}/${colorId}`,
                method: "DELETE"
            })
        })
    })
})

export const {useCreateColorMutation, useGetAllColorsQuery, useDeleteColorMutation, useUpdateColorMutation} = colorApiSlice