import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  useSendEmailCodeMutation,
  useSendMobileCodeMutation,
  useVerifyEmailCodeMutation,
} from "@/redux/api/verificationApiSlice";
import React, { useState } from "react";
import { IoMdArrowForward } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";

import * as Yup from "yup";
import { useFormik } from "formik";

const SendCode = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sendEmailCode] = useSendEmailCodeMutation();
  const [sendVerifyCodeToMobile] = useSendMobileCodeMutation();

  const { text } = location.state || {};

  const handleSignUpClick = () => {
    navigate("/auth?form=signup");
  };

  const handleSignInClick = () => {
    navigate("/auth?form=signin");
  };

  return (
    <section className="flex justify-center my-10">
      <main className="bg-white shadow-2xl w-full mx-4 sm:mx-0 sm:w-[30%]">
        <div className="flex items-center text-2xl justify-evenly">
          <h1 className="p-3">
            {text ? `${text} Password` : "Forget Password"}
          </h1>
        </div>
        <div className="flex flex-col justify-center w-full sm:px-10 px-4">
          <p className="text-center">
            Enter the email address or mobile phone number associated with your
            ShopKart account.
          </p>
          <div className="w-full my-4 space-y-2">
            <label htmlFor="" className="font-semibold">
              Email Address/Mobile Number
            </label>
            <Input
              type="email"
              placeholder="Email or Mobile"
              className="outline-gray-400 outline outline-1"
            />
          </div>
          <Button variant="shop">
            Send Code
            <IoMdArrowForward className="text-xl ml-2" />
          </Button>
          <div className="mt-4">
            <p>
              Already have account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={handleSignInClick}
              >
                Sign In
              </span>
            </p>
            <p>
              Don’t have account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={handleSignUpClick}
              >
                Sign Up
              </span>
            </p>
          </div>
          <p className="my-4">
            You may contact{" "}
            <span className="text-orange-500">Customer Service</span> for help
            restoring access to your account.
          </p>
        </div>
      </main>
    </section>
  );
};

const VerifyCode = ({ userInfo, email }) => {
  const navigate = useNavigate();

  const { toast } = useToast();

  const [isSendingCodeLoading, setIsSendingCodeLoading] = useState(false);

  const [verifyEmailOtp] = useVerifyEmailCodeMutation();
  const [sendEmailCode] = useSendEmailCodeMutation();

  const validationSchema = Yup.object().shape({
    enteredOtp: Yup.string().required("OTP is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      enteredOtp: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await verifyEmailOtp({
          email,
          enteredOtp: values.enteredOtp,
        });
        if (response.error) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          });
          setSubmitting(false);
          return;
        }
        const refetchedData = await refetch();
        const updatedUserInfo = refetchedData?.data?.data;
        await dispatch(setCredentials(updatedUserInfo));
        toast({
          title: "Email verified!",
          description: "Your email has been successfully verified.",
        });
        setSubmitting(false);

        if (!userInfo.isMobileVerified) {
          navigate("/verify-phone");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.log("Cannot verify the email", error);
        setSubmitting(false);
      }
    },
  });

  const handleResendEmailOtp = async () => {
    setIsSendingCodeLoading(true);
    try {
      const response = await sendEmailCode(email);

      if (response.error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
        setIsSendingCodeLoading(false);
        return;
      } else {
        toast({
          title: "OTP resent!",
          description: "OTP resent, check your email.",
        });
        setIsSendingCodeLoading(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      console.log("Cannot send the verification code to your email", error);
      setIsSendingCodeLoading(false);
    }
  };

  return (
    <section className="flex justify-center my-10">
      <main className="bg-white shadow-2xl w-full mx-4 sm:mx-0 sm:w-[30%] pb-6">
        <div className="flex items-center text-2xl justify-evenly">
          <h1 className="p-3">Verify Your Email</h1>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col justify-center w-full sm:px-10 px-4"
        >
          <p className="text-center">
            To verify your email address, please enter the verification code
            sent to your inbox.
          </p>
          <div className="w-full my-4 space-y-2">
            <label htmlFor="otp" className="font-semibold flex justify-between">
              Verification Code{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={handleResendEmailOtp}
              >
                {isSendingCodeLoading ? "Resending..." : "Resend Code"}
              </span>
            </label>
            <Input
              id="otp"
              name="enteredOtp"
              type="number"
              value={formik.values.enteredOtp}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Code"
              className="outline-gray-400 outline outline-1"
            />
            {formik.touched.enteredOtp && formik.errors.enteredOtp ? (
              <div className="text-red-500 text-sm">
                {formik.errors.enteredOtp}
              </div>
            ) : null}
          </div>
          <Button type="submit" disabled={formik.isSubmitting} variant="shop">
            {formik.isSubmitting ? (
              <span className="flex items-center gap-2">
                Verify Me
                <Loader
                  size="2em"
                  speed="0.4s"
                  topBorderSize="0.2em"
                  center={false}
                  fullScreen={false}
                />
                <IoMdArrowForward className="text-xl" />
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Verify Me
                <IoMdArrowForward className="text-xl" />
              </span>
            )}
          </Button>
        </form>
      </main>
    </section>
  );
};

const ForgetPassword = () => {
  const { isClickedOnSendCode, setisClickedOnSendCode } = useState(false);

  const handleSendCodeClick = () => {
    setisClickedOnSendCode(true);
  };
  return (
    <section>{isClickedOnSendCode ? <VerifyCode /> : <SendCode />}</section>
  );
};

export default ForgetPassword;
