import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Discount } from "../models/discount.model.js";

const createDiscount = asyncHandler(async (req, res) => {
  const { discountName, discountType, discountValue, discountExpiry } =
    req.body;

  if (!discountName || !discountType || !discountValue) {
    throw new ApiError(400, "Please fill all the fields related to discount");
  }

  const existedDiscount = await Discount.findOne({ discountName });

  if (existedDiscount) {
    throw new ApiError(400, "This discount already exisin the database");
  }

  const discount = await Discount.create({
    discountName,
    discountType,
    discountValue,
    discountExpiry,
  });

  const createdDiscount = await Discount.findById(discount._id);

  res
    .status(201)
    .json(
      new ApiResponse(200, createdDiscount, "The discount created successfully")
    );
});

const updateDiscount = asyncHandler(async (req, res) => {
  const { discountId } = req.params;

  const { discountName, discountType, discountValue, discountExpiry } =
    req.body;

  if (
    !discountName ||
    !discountType ||
    !discountValue ||
    !beforePrice ||
    !afterPrice
  ) {
    throw new ApiError(
      400,
      "Please fill all the fields for updation related to discount"
    );
  }

  const discount = await Discount.findById(discountId);

  const updateDiscount = await Discount.findByIdAndUpdate(
    discount._id,
    {
      discountName,
      discountType,
      discountValue,
      discountExpiry,
    },
    { new: true }
  );

  res
    .status(201)
    .json(
      new ApiResponse(200, updateDiscount, "The discount updated successfully")
    );
});

const getDiscountById = asyncHandler(async (req, res) => {
  const { discountId } = req.params;

  const discount = await Discount.findById(discountId);

  res
    .status(201)
    .json(new ApiResponse(200, discount, "You get the discount by its Id"));
});

const deleteDiscountById = asyncHandler(async (req, res) => {
  const { discountId } = req.params;

  const discount = await Discount.findByIdAndDelete(discountId);

  if (!discount) {
    throw new ApiError(400, discount, "Cannot find the discount for deletion");
  }

  res
    .status(201)
    .json(new ApiResponse(200, discount, "The discount deleted successfully"));
});

const getAllDiscount = asyncHandler(async (req, res) => {
  const discount = await Discount.find({});

  if (!discount) {
    throw new ApiError(400, "Cannot get all the discounts");
  }

  res
    .status(201)
    .json(new ApiResponse(200, discount, "You got all the discounts"));
});

export {
  createDiscount,
  updateDiscount,
  getDiscountById,
  deleteDiscountById,
  getAllDiscount,
};
