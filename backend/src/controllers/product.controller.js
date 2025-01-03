import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Product } from "../models/product.model.js";
import { Brand } from "../models/brand.model.js";
import { Category } from "../models/category.model.js";
import { Discount } from "../models/discount.model.js";
import mongoose from "mongoose";
import uploadOnCloudinary from "../utils/cloudinary.js";

const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    discountedPrice,
    brand,
    category,
    sku,
    specifications,
    additionalInformation,
    deliveryInfo,
    stockQuantity,
    tags,
    review,
    discount,
  } = req.body;

  if (
    !title ||
    !description ||
    !price ||
    !brand ||
    !category ||
    !stockQuantity ||
    !tags
  ) {
    throw new ApiError(400, "Please fill all the fields for product");
  }

  const existedProduct = await Product.findOne({ title });

  if (existedProduct) {
    throw new ApiError(400, "This product already existed in the database");
  }

  const imageOfProductLocalPath = req.files?.productImage?.map(
    (file) => file.path
  );

  const videoOfProductLocalPath = req.files?.productVideo?.[0]?.path;

  const imageOfProduct = await uploadOnCloudinary(imageOfProductLocalPath);
  const videoOfProduct = await uploadOnCloudinary(videoOfProductLocalPath);

  const productImage = Array.isArray(imageOfProduct)
    ? imageOfProduct.map((img) => img.url)
    : imageOfProduct?.url;

  const generateSku = sku || new Product().generateSku();

  const brandName = await Brand.findById(brand);
  if (!brandName) {
    throw new ApiError(404, "Cannot found the brand name");
  }

  const categoryName = await Category.findById(category);
  if (!categoryName) {
    throw new ApiError(404, "Cannot found the category name");
  }

  const product = await Product({
    title,
    description,
    productImage,
    productVideo: videoOfProduct?.url,
    price,
    discountedPrice,
    brand: brandName._id,
    category: categoryName._id,
    sku: generateSku,
    specifications,
    additionalInformation,
    deliveryInfo,
    stockQuantity,
    tags,
    review,
    discount,
  });

  if (discount) {
    product.discount = discount;
    product.discountedPrice = await product.calculateDiscountedPrice();
  } else {
    product.discountedPrice = 0;
  }

  await product.save();

  const createdProduct = await Product.findById(product._id)
    .populate("brand")
    .populate("category")
    .populate("reviews");

  res
    .status(201)
    .json(
      new ApiResponse(200, createdProduct, "The product created successfully.")
    );
});

const addDiscountToAProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const { discountName, discountType, discountValue, discountExpiry } =
    req.body;

  if (!discountName || !discountType || !discountValue) {
    throw new ApiError(
      404,
      "All the field are required for adding discount to a product"
    );
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const discount = new Discount({
    discountName,
    discountType,
    discountValue,
    discountExpiry,
  });

  await discount.save();

  product.discount.push(discount._id);

  product.discountedPrice = await product.calculateDiscountedPrice();

  await product.save();

  res
    .status(201)
    .json(
      new ApiResponse(
        200,
        product,
        "The discount added to the product successfully"
      )
    );
});

const updateExpireDiscounts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    discount: { $exists: true, $ne: [] },
  }).populate("discount");

  for (const product of products) {
    let updateNeeded = false;
    let validDiscounts = [];

    // Filter out expired discounts
    validDiscounts = product.discount.filter((discount) => {
      if (discount.discountExpiry && discount.discountExpiry <= new Date()) {
        updateNeeded = true;
        return false; // Remove expired discount
      }
      return true; // Keep valid discounts
    });

    // If any expired discounts were found, update the product
    if (updateNeeded) {
      product.discount = validDiscounts;

      // Recalculate the discounted price
      const newDiscountedPrice = await product.calculateDiscountedPrice();
      product.discountedPrice = newDiscountedPrice;

      await product.save();
      console.log(
        `Updated product: ${product.title}, New Discounted Price: ${product.discountedPrice}`
      );
    }
  }
});

const deleteADiscountFromProduct = asyncHandler(async (req, res) => {
  const { productId, discountId } = req.params;

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(400, "Cannot found the product for deleting");
  }

  const findDiscountIndex = product.discount.findIndex(
    (discount) => discount._id.toString() === discountId
  );

  if (findDiscountIndex === -1) {
    res.status(201).json(new ApiResponse(200, "The hvfh"));
  }

  product.discount.splice(findDiscountIndex, 1);

  product.discountedPrice = await product.calculateDiscountedPrice();

  await product.save();

  res
    .status(201)
    .json(new ApiResponse(200, product, "The discount removed successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const {
    title,
    description,
    price,
    discountedPrice,
    brand,
    category,
    sku,
    specifications,
    additionalInformation,
    deliveryInfo,
    stockQuantity,
    tags,
    review,
  } = req.body;

  if (
    !title ||
    !description ||
    !price ||
    !brand ||
    !category ||
    !stockQuantity ||
    !tags
  ) {
    throw new ApiError(400, "Please fill all the fields for product");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(400, "Cannot find the product by id for updation");
  }

  const imageOfProductLocalPath = req.files?.productImage?.map(
    (file) => file.path
  );

  const videoOfProductLocalPath = req.files?.productVideo?.[0]?.path;

  const imageOfProduct = await uploadOnCloudinary(imageOfProductLocalPath);
  const videoOfProduct = await uploadOnCloudinary(videoOfProductLocalPath);

  const productImage = Array.isArray(imageOfProduct)
    ? imageOfProduct.map((img) => img.url)
    : imageOfProduct?.url;

  const updatedProduct = await Product.findByIdAndUpdate(
    product._id,
    {
      title,
      description,
      productImage,
      productVideo: videoOfProduct?.url,
      price,
      discountedPrice,
      brand,
      category,
      sku,
      specifications,
      additionalInformation,
      deliveryInfo,
      stockQuantity,
      tags,
      review,
    },
    { new: true }
  );

  if (!updatedProduct) {
    throw new ApiError(400, "Cannot update the product");
  }

  res
    .status(201)
    .json(
      new ApiResponse(200, updatedProduct, "The product updated successfully.")
    );
});

const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(productId) },
    },
    {
      $lookup: {
        from: "brands",
        localField: "brand",
        foreignField: "_id",
        as: "brand",
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "reviews",
        foreignField: "_id",
        as: "reviews",
      },
    },
    {
      $lookup: {
        from: "discounts",
        localField: "discount",
        foreignField: "_id",
        as: "discount",
      },
    },
    {
      $lookup: {
        from: "coupons",
        localField: "coupon",
        foreignField: "_id",
        as: "coupon",
      },
    },
    {
      $unwind: {
        path: "$brand",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$coupon",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "profiles",
        localField: "reviews.userId",
        foreignField: "userId",
        as: "commenters",
      },
    },
    {
      $addFields: {
        reviews: {
          $map: {
            input: "$reviews",
            as: "review",
            in: {
              _id: "$$review._id",
              userId: "$$review.userId",
              rating: "$$review.rating",
              comment: "$$review.comment",
              commenterName: {
                $cond: {
                  if: {
                    $ne: [
                      {
                        $indexOfArray: [
                          "$commenters.userId",
                          "$$review.userId",
                        ],
                      },
                      -1,
                    ],
                  },
                  then: {
                    $concat: [
                      {
                        $ifNull: [
                          {
                            $arrayElemAt: [
                              "$commenters.firstName",
                              {
                                $indexOfArray: [
                                  "$commenters.userId",
                                  "$$review.userId",
                                ],
                              },
                            ],
                          },
                          "Anonymous",
                        ],
                      },
                      " ",
                      {
                        $ifNull: [
                          {
                            $arrayElemAt: [
                              "$commenters.lastName",
                              {
                                $indexOfArray: [
                                  "$commenters.userId",
                                  "$$review.userId",
                                ],
                              },
                            ],
                          },
                          "User",
                        ],
                      },
                    ],
                  },
                  else: "Anonymous User",
                },
              },
              commenterImage: {
                $cond: {
                  if: {
                    $ne: [
                      {
                        $indexOfArray: [
                          "$commenters.userId",
                          "$$review.userId",
                        ],
                      },
                      -1,
                    ],
                  },
                  then: {
                    $ifNull: [
                      {
                        $arrayElemAt: [
                          "$commenters.profileImage",
                          {
                            $indexOfArray: [
                              "$commenters.userId",
                              "$$review.userId",
                            ],
                          },
                        ],
                      },
                      "defaultImage.png",
                    ],
                  },
                  else: "defaultImage.png",
                },
              },
            },
          },
        },
        discount: {
          $map: {
            input: "$discount",
            as: "discountItem",
            in: {
              _id: "$$discountItem._id",
              discountName: "$$discountItem.discountName",
              discountValue: "$$discountItem.discountValue",
              discountType: "$$discountItem.discountType",
            },
          },
        },
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        productImage: 1,
        productVideo: 1,
        price: 1,
        discountedPrice: 1,
        brand: 1,
        category: 1,
        sku: 1,
        additionalInformation: 1,
        specifications: 1,
        stockQuantity: 1,
        tags: 1,
        deliveryInfo: 1,
        discount: 1,
        coupon: 1,
        reviews: 1,
      },
    },
  ]);

  if (product.length === 0) {
    throw new ApiError(400, "Cannot find the product by id");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, product[0], "Product details fetched successfully.")
    );
});

const deleteProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findByIdAndDelete(productId);

  if (!product) {
    throw new ApiError(400, "Cannot find the product for deletion.");
  }

  res
    .status(201)
    .json(new ApiResponse(200, product, "The product deleted successfully."));
});

const getAllProduct = asyncHandler(async (req, res) => {
  const {
    filterCategory: categoryName,
    filterBrand: brandName,
    filterTags,
    filterPrice,
    sort,
    search,
    searchSuggestion,
    page,
    limit,
  } = req.query;

  let query = Product.find({});

  //filteration of the products

  if (categoryName) {
    const categories = await Category.find(
      { categoryName: { $in: categoryName.split(",") } },
      "_id"
    );
    if (!categories || categories.length === 0) {
      throw new ApiError(404, "Category not found");
    }

    query = query.find({
      category: { $in: categories.map((category) => category._id) },
    });
  }

  if (brandName) {
    const brands = await Brand.find(
      { brandName: { $in: brandName.split(",") } },
      "_id"
    );
    if (!brands || brands.length === 0) {
      throw new ApiError(400, "Cannot found brand");
    }

    query = query.find({ brand: { $in: brands.map((brand) => brand._id) } });
  }

  if (filterTags) {
    query = query.find({ tags: { $in: filterTags.split(",") } });
  }

  if (filterPrice) {
    const priceRanges = filterPrice.split(",");

    const priceConditions = priceRanges.map((range) => {
      const priceRange = range.split("-");
      if (priceRange.length !== 2) {
        throw new ApiError(400, "Both minimum and maximum prices are required");
      }
      const [minPrice, maxPrice] = priceRange;
      if (!minPrice || !maxPrice) {
        throw new ApiError(404, "Invalid price range");
      }
      return { price: { $gte: minPrice, $lte: maxPrice } };
    });

    query = query.find({ $or: priceConditions });
  }

  //sorting of the product

  if (sort === "price_asc") {
    query = query.sort({ price: 1 });
  }

  if (sort === "price_desc") {
    query = query.sort({ price: -1 });
  }

  // if(sort === "popularity"){
  //     query = query.sort({
  //     })
  // }

  if (sort === "recency_desc") {
    query = query.sort({ createdAt: -1 });
  }

  //search suggestion
  if (searchSuggestion) {
    const suggestion = await Product.find({
      title: { $regex: suggestion, $options: "i" },
    })
      .limit(10)
      .select("title");
    res
      .status(201)
      .json(
        new ApiResponse(
          200,
          suggestion,
          "You got the suggestion for the searching of the product"
        )
      );
    return;
  }

  //search the product
  if (search) {
    query = query.find({
      $text: { $search: search },
    });
  }

  //pagination
  const skip = (page - 1) * limit;

  if (page && limit) {
    query = query.skip(skip).limit(limit);
  }

  const totalProducts = await Product.countDocuments();
  const totalPages = Math.ceil(totalProducts / limit);

  const products = await query.exec();

  if (!products || products.length === 0) {
    throw new ApiError(404, "Cannot found the product");
  }

  res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { products, page, totalProducts, totalPages },
        "You got all the products successfully."
      )
    );
});

export {
  createProduct,
  addDiscountToAProduct,
  updateExpireDiscounts,
  updateProduct,
  getProductById,
  deleteProductById,
  deleteADiscountFromProduct,
  getAllProduct,
};
