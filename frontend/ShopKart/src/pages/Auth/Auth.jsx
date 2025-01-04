import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { IoMdArrowForward } from "react-icons/io";
import { FaApple } from "react-icons/fa";
import { PiEye, PiEyeSlash } from "react-icons/pi";

import googleLogo from "../../assets/images/googleLogo.png";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/redux/api/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useLocation, useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
import Loader from "@/components/mycomponents/Loader";
import { useToast } from "@/hooks/use-toast";

const SignUp = ({ onSignUpSuccess }) => {
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [registerUser] = useRegisterUserMutation();

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswodToggle = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Password must match")
      .required("Confirm password is required"),
    terms: Yup.boolean().oneOf(
      [true],
      "You must accept the terms and conditions"
    ),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const signUpData = {
          username: values.username,
          email: values.email,
          password: values.password,
        };
        await registerUser(signUpData);
        toast({
          title: "Sign-Up successful! Welcome!",
          description: "Please sign in with your new account.",
        });
        onSignUpSuccess();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Sign-Up failed!",
          description: "There was a problem creating your account.",
        });
        console.log("Cannot register user");
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="space-y-4 w-[80%] pb-10 pt-5"
      >
        <div className="space-y-2">
          <label htmlFor="">Name</label>
          <Input
            type="text"
            id="username"
            placeholder="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="outline-gray-400 outline outline-1"
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="text-red-500 text-sm">{formik.errors.username}</div>
          ) : null}
        </div>
        <div className="space-y-2">
          <label htmlFor="">Email Address</label>
          <Input
            type="email"
            id="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="outline-gray-400 outline outline-1"
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          ) : null}
        </div>
        <div className="space-y-2">
          <label htmlFor="">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="pr-10 outline-gray-400 outline outline-1"
            />
            {showPassword ? (
              <PiEye
                onClick={handlePasswordToggle}
                className="text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              />
            ) : (
              <PiEyeSlash
                onClick={handlePasswordToggle}
                className="text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              />
            )}
          </div>
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          ) : null}
        </div>
        <div className="space-y-2">
          <label htmlFor="">Confirm Password</label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm Password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="pr-10 outline-gray-400 outline outline-1"
            />
            {showConfirmPassword ? (
              <PiEye
                onClick={handleConfirmPasswodToggle}
                className="text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              />
            ) : (
              <PiEyeSlash
                onClick={handleConfirmPasswodToggle}
                className="text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              />
            )}
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="text-red-500 text-sm">
              {formik.errors.confirmPassword}
            </div>
          ) : null}
        </div>
        <div className="flex gap-2 w-full">
          <Checkbox
            className="mt-1"
            id="terms"
            name="terms"
            checked={formik.values.terms}
            onCheckedChange={(checked) =>
              formik.setFieldValue("terms", checked)
            }
            onBlur={formik.handleBlur}
          />
          <label htmlFor="terms" className="cursor-pointer">
            Are you agree to ShopKart{" "}
            <span className="text-blue-400">Terms of Condition</span> and{" "}
            <span className="text-blue-400">Privacy Policy.</span>
          </label>
        </div>
        {formik.touched.terms && formik.errors.terms ? (
          <div className="text-red-500 text-sm">{formik.errors.terms}</div>
        ) : null}
        <Button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full py-3 rounded mt-4"
          variant="shop"
        >
          {formik.isSubmitting ? (
            <span className="flex items-center gap-2">
              Signing Up...
              <Loader
                size="2em"
                speed="0.4s"
                topBorderSize="0.2em"
                center={false}
                fullScreen={false}
              />
            </span>
          ) : (
            "Sign Up"
          )}
          <IoMdArrowForward className="text-lg ml-2" />
        </Button>
        <div className="flex items-center sm:gap-16 gap-5 pl-2 hover:cursor-pointer border border-1 border-solid border-gray-400 w-full py-2">
          <img src={googleLogo} alt="" className="w-[2vw] h-[2vw]" />
          <p>Sign up with Google</p>
        </div>
        <div className="flex items-center sm:gap-16 gap-5 pl-2 hover:cursor-pointer border border-1 border-solid border-gray-400 w-full py-2">
          <FaApple className="text-3xl" />
          <p>Sign up with Apple</p>
        </div>
      </form>
    </>
  );
};

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const [loginUser] = useLoginUserMutation();

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const signInData = {
          username: values.username,
          email: values.email,
          password: values.password,
        };
        const login = await loginUser(signInData);
        const userData = login.data.data.user;
        await dispatch(setCredentials(userData));

        if (userData) {
          toast({
            title: "Login successful! Welcome back!",
            description: "You have successfully logged in.",
          });
          if (!userData?.isEmailVerified) {
            navigate("/verify-email");
          } else if (!userData?.isMobileVerified) {
            navigate("/verify-phone");
          } else {
            navigate("/");
          }
        }

        setSubmitting(false);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
        console.log("Cannot login user");
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="space-y-4 w-[80%] pb-10 pt-5"
      >
        <div className="space-y-2">
          <label htmlFor="">Email Address</label>
          <Input
            type="email"
            id="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="rounded outline-gray-400 outline outline-1"
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          ) : null}
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="flex justify-between">
            Password{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/forget-password")}
            >
              Forget Password
            </span>
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="pr-10 outline-gray-400 outline outline-1"
            />
            {showPassword ? (
              <PiEye
                onClick={handlePasswordToggle}
                className="text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              />
            ) : (
              <PiEyeSlash
                onClick={handlePasswordToggle}
                className="text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              />
            )}
          </div>
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          ) : null}
        </div>
        <Button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full py-3 rounded"
          variant="shop"
        >
          {formik.isSubmitting ? (
            <span className="flex items-center gap-2">
              Signing In...
              <Loader
                size="2em"
                speed="0.4s"
                topBorderSize="0.2em"
                center={false}
                fullScreen={false}
              />
            </span>
          ) : (
            "Sign In"
          )}
          <IoMdArrowForward className="text-lg ml-2" />
        </Button>
        <div className="flex items-center gap-16 pl-2 hover:cursor-pointer border border-1 border-solid border-gray-400 w-full py-2">
          <img src={googleLogo} alt="" className="w-[2vw] h-[2vw]" />
          <p>Sign up with Google</p>
        </div>
        <div className="flex items-center gap-16 pl-2 hover:cursor-pointer border border-1 border-solid border-gray-400 w-full py-2">
          <FaApple className="text-3xl" />
          <p>Sign up with Apple</p>
        </div>
      </form>
    </>
  );
};

const Auth = () => {
  const location = useLocation();

  const [auth, setAuth] = useState(false);
  const [isBorderBottomOnAuth, setIsBorderBottomOnAuth] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const formType = query.get("form");

    if (formType === "signup") {
      setAuth(true);
      setIsBorderBottomOnAuth(true);
    }

    if (formType === "signin") {
      setAuth(false);
      setIsBorderBottomOnAuth(false);
    }
  }, [location]);

  const handleClickedOnSignUp = () => {
    setAuth(true);
    setIsBorderBottomOnAuth(true);
  };
  const handleClickedOnSignIn = () => {
    setAuth(false);
    setIsBorderBottomOnAuth(false);
  };

  const handleSignUpSuccess = () => {
    setAuth(false);
    setIsBorderBottomOnAuth(false);
  };

  return (
    <section className="flex justify-center my-10">
      <main className="bg-white shadow-2xl w-full mx-4 sm:mx-0 sm:w-[30%]">
        <div className="flex items-center text-2xl justify-evenly">
          <h1
            onClick={handleClickedOnSignIn}
            className={`hover:cursor-pointer p-3 ${
              !isBorderBottomOnAuth
                ? "border-b-orange-400 border-solid border-b-4"
                : ""
            }`}
          >
            Sign In
          </h1>
          <h1
            onClick={handleClickedOnSignUp}
            className={`hover:cursor-pointer p-3 ${
              isBorderBottomOnAuth
                ? "border-b-orange-400 border-solid border-b-4"
                : ""
            }`}
          >
            Sign Up
          </h1>
        </div>
        <div className="flex flex-col justify-center items-center w-full">
          {auth ? <SignUp onSignUpSuccess={handleSignUpSuccess} /> : <SignIn />}
        </div>
      </main>
    </section>
  );
};

export default Auth;
