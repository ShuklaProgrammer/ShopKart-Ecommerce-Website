import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Profile } from "../models/profile.model.js";

// Create or update profile and handle address linking
const createProfile = asyncHandler(async (req, res) => {
  const {
    userId,
    firstName,
    lastName,
    secondaryEmail,
    contactNumber,
    deliveryAddress,
  } = req.body;

  if (!userId) {
    throw new ApiError(500, "User ID is required");
  }

  // Create or update profile
  let profile = await Profile.findOne({ userId });
  if (!profile) {
    const profileImg = req.files?.profileImage?.[0]?.path;

    profile = await Profile.create({
      userId,
      profileImage: profileImg,
      firstName,
      lastName,
      secondaryEmail,
      contactNumber,
    });
  } else {
    // Update profile fields if they are provided
    if (firstName) profile.firstName = firstName;
    if (lastName) profile.lastName = lastName;
    if (secondaryEmail) profile.secondaryEmail = secondaryEmail;
    if (contactNumber) profile.contactNumber = contactNumber;
    if (req.files?.profileImage?.[0]?.path)
      profile.profileImage = req.files.profileImage[0].path;

    await profile.save();
  }

  // Create new addresses if deliveryAddress is provided
  if (deliveryAddress) {
    profile.deliveryAddress.push(deliveryAddress);
    await profile.save();
  }

  const createdProfile = await Profile.findById(profile._id);

  res
    .status(201)
    .json(
      new ApiResponse(
        200,
        createdProfile,
        "Profile and address processing completed successfully"
      )
    );
});

const updateProfile = asyncHandler(async (req, res) => {
  const {
    userId,
    firstName,
    lastName,
    secondaryEmail,
    contactNumber,
    deliveryAddress,
    addressId,
  } = req.body;

  if (!userId) {
    throw new ApiError(500, "User ID is required");
  }

  const profileImg = req.files?.profileImage?.[0]?.path;

  const profile = await Profile.findOne({ userId });

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  // Update profile fields if they are provided
  if (firstName) profile.firstName = firstName;
  if (lastName) profile.lastName = lastName;
  if (secondaryEmail) profile.secondaryEmail = secondaryEmail;
  if (contactNumber) profile.contactNumber = contactNumber;
  if (profileImg) profile.profileImage = profileImg;

  // Update specific delivery address if addressId and deliveryAddress are provided
  if (addressId && deliveryAddress) {
    const address = profile.deliveryAddress.id(addressId);
    if (!address) {
      throw new ApiError(404, "Address not found");
    }
    address.set(deliveryAddress);
  }

  await profile.save();

  res
    .status(200)
    .json(new ApiResponse(200, profile, "The profile updated successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;

  const userProfile = await Profile.findOne({ userId });

  if (!userProfile) {
    throw new ApiError(404, "Cannot found user profile");
  }

  res
    .status(201)
    .json(
      new ApiResponse(200, userProfile, "You get user profile successfully")
    );
});

const deleteUserProfile = asyncHandler(async (req, res) => {
  const { addressId, userId } = req.body;

  if (!userId) {
    throw new ApiError(400, "Please provide the userId");
  }

  const profile = await Profile.findOne({ userId });

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  if (addressId) {
    const addressIndex = profile.deliveryAddress.findIndex((item) =>
      item._id.equals(addressId)
    );

    if (addressIndex === -1) {
      throw new ApiError(404, "Address not found");
    }

    // Remove the address from the deliveryAddress array
    profile.deliveryAddress.splice(addressIndex, 1);

    await profile.save();

    res
      .status(201)
      .json(
        new ApiResponse(
          200,
          profile,
          "One delivery address successfully deleted"
        )
      );
  } else {
    // Delete the entire profile
    await Profile.deleteOne({ userId });

    res
      .status(201)
      .json(new ApiResponse(200, null, "Profile successfully deleted"));
  }
});

export { createProfile, updateProfile, getUserProfile, deleteUserProfile };
