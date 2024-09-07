import { apiSlice } from "./apiSlice";

import { EMAIL_VERIFY_URL, MOBILE_VERIFY_URL } from "../constants.js";

const mobileVerification = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        sendMobileCode: builder.mutation({
            query: (phoneNumber) => ({
                url: `${MOBILE_VERIFY_URL}/send-verification-code`,
                method: "POST",
                body: {phoneNumber}
            })
        }),

        verifyMobileCode: builder.mutation({
            query: ({phoneNumber, code, userId}) => ({
                url: `${MOBILE_VERIFY_URL}/verify-code`,
                method: "POST",
                body: {phoneNumber, code, userId}
            })
        }),

        sendEmailCode: builder.mutation({
            query: (email) => ({
                url: `${EMAIL_VERIFY_URL}/send-email-otp`,
                method: "POST",
                body: {email}
            })
        }),

        verifyEmailCode: builder.mutation({
            query: ({email, enteredOtp}) => ({
                url: `${EMAIL_VERIFY_URL}/verify-email-otp`,
                method: "POST",
                body: {email, enteredOtp}
            })
        })
    })
})

export const {useSendMobileCodeMutation, useVerifyMobileCodeMutation, useSendEmailCodeMutation, useVerifyEmailCodeMutation} = mobileVerification