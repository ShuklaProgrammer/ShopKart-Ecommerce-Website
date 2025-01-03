import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

const addReviewToProduct = asyncHandler(async (req, res) => {
  const { userId, productId, rating, comment } = req.body;

  if (!userId || !productId) {
    throw new ApiError(400, "Please give the productId, userId and comment");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Cannot found the product");
  }

  const reviews = new Review({
    userId,
    productId,
    rating,
    comment,
  });

  const savedReview = await reviews.save();

  // if (!product.reviews) {
  //     product.reviews = []; // Initialize reviews array if not exists
  // }

  product.reviews.push(savedReview._id);
  await product.save();

  res
    .status(201)
    .json(
      new ApiResponse(
        200,
        savedReview,
        "The review added to the product successfully"
      )
    );
});

const deleteUserReview = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { reviewId } = req.body;

  if (!userId || !reviewId) {
    throw new ApiError(400, "Please provide the userId and reviewID");
  }

  const review = await Review.deleteOne({ userId, _id: reviewId });

  if (!review) {
    throw new ApiError(404, "Cannot found that review");
  }

  res
    .status(201)
    .json(new ApiResponse(200, review, "User review deleted successfully"));
});

const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  if (!reviewId) {
    throw new ApiError(400, "Review ID is required.");
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "Cannot found the review by id");
  }

  const product = await Product.findById(review.productId);

  if (!product) {
    throw new ApiError(404, "Cannnot found the product by id");
  }

  product.reviews.pull(reviewId);

  await product.save();

  const deletedReview = await Review.findByIdAndDelete(reviewId);
  if (!deleteReview) {
    throw new ApiError(404, "Cannot found the review for deletion");
  }

  if (product.reviews.length === 0) {
    await Product.findByIdAndUpdate(product._id, { $unset: { reviews: 1 } });
  }

  res
    .status(201)
    .json(
      new ApiResponse(200, deletedReview, "The review deleted successfully")
    );
});

const getAllReviewOfProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const review = await Review.find({ productId });

  if (!review || review.length === 0) {
    throw new ApiError(404, "No reviews are available for this product");
  }

  res
    .status(201)
    .json(
      new ApiResponse(
        200,
        review,
        "The got all the review for that particular product"
      )
    );
});

const getAllReviews = asyncHandler(async (req, res) => {
  const review = await Review.find({});

  res
    .status(201)
    .json(
      new ApiResponse(
        200,
        review,
        "Yo got all the review present in the database"
      )
    );
});

const topReviews = asyncHandler(async (req, res) => {
  const topReview = await Review.aggregate([
    // Sort reviews by rating (highest first) and recency
    {
      $sort: { rating: -1, createdAt: -1 },
    },
    // Group by userId and select the top review for each user
    {
      $group: {
        _id: "$userId", // Group by userId
        topReview: { $first: "$$ROOT" }, // Select the highest-rated review per user
      },
    },
    // Lookup the user details for each review
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    // Unwind the user array to flatten the results
    {
      $unwind: "$user",
    },
    // Project the fields you need
    {
      $project: {
        _id: "$topReview._id",
        rating: "$topReview.rating",
        comment: "$topReview.comment",
        username: "$user.username",
      },
    },
    // Optionally sort by rating again if needed
    {
      $sort: { rating: -1 },
    },
    // Limit to the top 5 reviews, adjust as needed
    {
      $limit: 5,
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(200, topReview, "You got the top reviews successfully")
    );
});

export {
  addReviewToProduct,
  deleteReview,
  deleteUserReview,
  getAllReviewOfProduct,
  getAllReviews,
  topReviews,
};
