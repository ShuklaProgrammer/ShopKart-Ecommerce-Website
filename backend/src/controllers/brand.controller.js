import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Brand } from "../models/brand.model.js";

//for creating brands
const createBrand = asyncHandler(async (req, res) => {
  //getting brand name request body
  const { brandName } = req.body;

  if (!brandName) {
    throw new ApiError(400, "Please mention the brand name");
  }

  const existedBrand = await Brand.findOne({ brandName });

  if (existedBrand) {
    throw new ApiError(400, "This brand already in the database");
  }

  const brand = await Brand.create({
    brandName,
  });

  const createdBrand = await Brand.findById(brand._id);

  res
    .status(201)
    .json(
      new ApiResponse(200, createdBrand, "The brand created successfully.")
    );
});

//for updating brands
const updateBrand = asyncHandler(async (req, res) => {
  const { brandId } = req.params;

  const { brandName } = req.body;

  //if brand name is not given
  if (!brandName) {
    throw new ApiError(400, "The brand name is no given");
  }

  const brand = await Brand.findById(brandId);

  const updateBrand = await Brand.findByIdAndUpdate(
    brand._id,
    { brandName },
    { new: true }
  );

  res
    .status(201)
    .json(new ApiResponse(200, updateBrand, "The brand updated successfully."));
});

//for getting all the brands
const getAllBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({});

  if (!brands) {
    throw new ApiError(400, "Cannot find all the brands");
  }

  res
    .status(201)
    .json(new ApiResponse(200, brands, "You got all the brands successfully"));
});

//for getting single brand
const getBrandById = asyncHandler(async (req, res) => {
  const { brandId } = req.params;

  const brand = await Brand.findById(brandId);

  if (!brand) {
    throw new ApiError(400, "Cannot get the brand by it's ID");
  }

  res.status(201).json(new ApiResponse(200, brand, "You get brand by it's ID"));
});

//for deleting single brand
const deleteBrandById = asyncHandler(async (req, res) => {
  const { brandId } = req.params;

  const brand = await Brand.findByIdAndDelete(brandId);

  if (!brand) {
    throw new ApiError(400, "Cannot find brand for deletion");
  }

  res
    .status(201)
    .json(new ApiResponse(200, brand, "You deleted brand successfully"));
});

export {
  createBrand,
  updateBrand,
  getAllBrands,
  getBrandById,
  deleteBrandById,
};
