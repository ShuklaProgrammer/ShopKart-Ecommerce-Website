import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Coupon } from "../models/coupon.model.js";

const createCoupon = asyncHandler(async (req, res) => {
  const {
    couponCode,
    couponType,
    couponValue,
    couponExpiry,
    couponMaxUses,
    usedCount,
    leftCount,
  } = req.body;

  if (!couponCode || !couponType || !couponValue || !couponExpiry) {
    throw new ApiError(400, "All the field are required related to the coupon");
  }

  const existedCoupon = await Coupon.findOne({ couponCode });

  if (existedCoupon) {
    throw new ApiError(400, "The coupon already exist");
  }

  const imageOfCoupon = req.files?.couponImage[0]?.path;

  if (!imageOfCoupon) {
    throw new ApiError("Coupon image is required");
  }

  const coupon = new Coupon({
    couponCode,
    couponImage: imageOfCoupon,
    couponType,
    couponValue,
    couponExpiry,
    couponMaxUses,
    usedCount,
    leftCount,
  });

  await coupon.save();

  //if the coupon created then send this response
  const createdCoupon = await Coupon.findById(coupon._id);

  res
    .status(201)
    .json(
      new ApiResponse(200, createdCoupon, "The coupon created successfully")
    );
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;

  const {
    couponCode,
    couponType,
    couponValue,
    couponExpiry,
    couponMaxUses,
    usedCount,
    leftCount,
  } = req.body;

  // console.log(couponCode)
  // console.log(couponType)
  // console.log(couponValue)
  // console.log(expirationDate)
  if (!couponId) {
    throw new ApiError(500, "Please give the couponID for coupon updation");
  }

  if (!couponCode || !couponType || !couponValue || !couponExpiry) {
    throw new ApiError(400, "All the field are required related to the coupon");
  }

  const imageOfCoupon = await req.files?.couponImage[0]?.path;

  if (!imageOfCoupon) {
    throw new ApiError(400, "Image of the coupon is required");
  }

  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw new ApiError(400, "Cannot find the coupon by ID");
  }

  //if the coupon is found then update it and send the response
  const updatedCoupon = await Coupon.findByIdAndUpdate(
    coupon._id,
    {
      couponCode,
      couponType,
      couponImage: imageOfCoupon,
      couponValue,
      couponExpiry,
      couponMaxUses,
      usedCount,
      leftCount,
    },
    { new: true }
  );

  res
    .status(201)
    .json(
      new ApiResponse(200, updatedCoupon, "The coupon updated successfully.")
    );
});

const getCouponById = asyncHandler(async (req, res) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw new ApiError(
      400,
      "Cannot find the coupon may be not available in the database"
    );
  }
  res
    .status(201)
    .json(
      new ApiResponse(200, coupon, "You got the coupon by it's id successfully")
    );
});

const deleteCouponById = asyncHandler(async (req, res) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findByIdAndDelete(couponId);

  if (!coupon) {
    throw new ApiError(400, "Cannot find coupon for deletion");
  }

  res
    .status(201)
    .json(new ApiResponse(200, coupon, "The coupon deleted successfully."));
});

const getAllCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.find({});

  if (!coupon) {
    throw new ApiError(400, "Cannot find all the coupons");
  }

  res.status(201).json(new ApiResponse(200, coupon, "You got all the coupons"));
});

export {
  createCoupon,
  updateCoupon,
  getCouponById,
  deleteCouponById,
  getAllCoupon,
};
