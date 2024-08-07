import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Order, OrderStatus } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";
import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";

// const addOrder = asyncHandler(async (req, res) => {
//     const { orderedBy, productId, paymentMethod } = req.body;

//     // Get product details from the Product model

//     const product = await Product.findById(productId);

//     if (!product) {
//         throw new ApiError(404, "Product not found");
//     }

//     // Find or create the cart
//     let cart = await Cart.findOne({ userId: orderedBy });

//     if (!cart) {
//         cart = new Cart({
//             userId: orderedBy,
//             cartItems: [],
//             discount: null,
//             subTotal: 0,
//             cartTotal: 0,
//         });
//     }

//     // Find the ordered product in the cart or add it if it doesn't exist
//     let cartProduct = cart.cartItems.find(item => item.productId.equals(productId));

//     if (!cartProduct) {
//         cartProduct = {
//             productId: productId,
//             productImage: product.productImage[0],
//             productName: product.title,
//             quantity: 1,
//             price: product.price,
//             discount: []
//         };
//         cart.cartItems.push(cartProduct);
//     }

//     // Create a new order for each checkout
//     const order = new Order({
//         orderedBy,
//         orderItems: [{
//             productId: productId,
//             quantity: 1,
//             price: product.price
//         }],
//         shipping: 10, // shipping amount is 10 by default
//         tax: 7, // tax amount is 7% by default
//         subTotal: 0,
//         totalPrice: 0,
//         paymentMethod,
//         orderStatus: OrderStatus.PENDING,
//     });

//     // Calculate subtotal for order
//     order.subTotal = order.orderItems.reduce((total, item) => total + item.quantity * item.price, 0);

//     // Calculate discount if available
//     let totalDiscount = 0;
//     order.orderItems.forEach(item => {
//         const itemDiscount = product.discount ? (item.price - product.discountedPrice) * item.quantity : 0;
//         totalDiscount += itemDiscount;
//     });

//     order.discount = totalDiscount;

//     // Calculate total after discount
//     const totalAfterDiscount = order.subTotal - totalDiscount;

//     // Calculate tax amount
//     const taxAmount = (totalAfterDiscount * order.tax) / 100;

//     // Calculate total price
//     order.totalPrice = totalAfterDiscount + taxAmount + order.shipping;

//     // Save the order
//     await order.save();

//     // Calculate subtotal
//     cart.subTotal = cart.cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

//     // Calculate discount if available
//     let totalDiscountForCart = 0;
//     cart.cartItems.forEach(item => {
//         const itemDiscount = item.productId.equals(productId) && product.discount ? (item.price - product.discountedPrice) * item.quantity : 0;
//         totalDiscountForCart += itemDiscount;
//     });

//     cart.discounts = totalDiscountForCart;

//     // Calculate total after discount
//     const totalAfterDiscountForCart = cart.subTotal - totalDiscountForCart;

//     // Calculate cart total
//     cart.cartTotal = totalAfterDiscountForCart;

//     // Save the cart
//     await cart.save();

//     res.status(201).json(new ApiResponse(201, order, "Order placed successfully"));
// });

const addOrder = asyncHandler(async (req, res) => {
    const { orderedBy, orderItems, paymentMethod } = req.body;

    // Ensure orderItems is an array
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
        throw new ApiError(400, "orderItems must be a non-empty array");
    }

    // Fetch all product details
    const productIds = orderItems.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== orderItems.length) {
        throw new ApiError(404, "One or more products not found");
    }

    // Create order items for the Order model
    const orderItemsData = orderItems.map(item => {
        const product = products.find(p => p._id.equals(item.productId));
        return {
            productId: product._id,
            quantity: item.quantity,
            price: product.price,
        };
    });

    // Create a new order
    const order = new Order({
        orderedBy,
        orderItems: orderItemsData,
        shipping: 10, // shipping amount is 10 by default
        tax: 7, // tax amount is 7% by default
        subTotal: 0,
        totalPrice: 0,
        paymentMethod,
        orderStatus: OrderStatus.PENDING,
    });

    // Calculate subtotal for order
    order.subTotal = orderItemsData.reduce((total, item) => total + item.quantity * item.price, 0);

    // Calculate discount if available
    let totalDiscount = 0;
    orderItemsData.forEach(item => {
        const product = products.find(p => p._id.equals(item.productId))
        const itemDiscount = product.discount ? (item.price - product.discountedPrice) * item.quantity : 0;
        totalDiscount += itemDiscount;
    });

    order.discount = totalDiscount;

    // Calculate total after discount
    const totalAfterDiscount = order.subTotal - totalDiscount;

    // Calculate tax amount
    const taxAmount = (totalAfterDiscount * order.tax) / 100;

    // Calculate total price
    order.totalPrice = totalAfterDiscount + taxAmount + order.shipping;

    // Save the order
    await order.save();

    // // Find or create the cart
    // let cart = await Cart.findOne({ userId: orderedBy });

    // if (!cart) {
    //     cart = new Cart({
    //         userId: orderedBy,
    //         cartItems: [],
    //         discount: null,
    //         subTotal: 0,
    //         cartTotal: 0,
    //     });
    // }

    // // Update or add products to the cart
    // orderItems.forEach(item => {
    //     const product = products.find(p => p._id.equals(item.productId));
    //     if (!product) {
    //         throw new ApiError(404, `Product with ID ${item.productId} not found`);
    //     }

    //     let cartProduct = cart.cartItems.find(cartItem => cartItem.productId.equals(item.productId));

    //     if (!cartProduct) {
    //         cartProduct = {
    //             productId: product._id,
    //             productImage: product.productImage[0],  // Assuming productImage is an array and we take the first image
    //             productName: product.title,
    //             quantity: item.quantity,
    //             price: product.price,
    //             discount: item.discount || []
    //         };
    //         cart.cartItems.push(cartProduct);
    //     } else {
    //         cartProduct.quantity += item.quantity;
    //     }
    // });

    // // Calculate subtotal for cart
    // cart.subTotal = cart.cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

    // // Calculate discount for cart if available
    // let totalDiscountForCart = 0;
    // cart.cartItems.forEach(item => {
    //     const product = products.find(p => p._id.equals(item.productId));
    //     const itemDiscount = product.discount ? (item.price - product.discountedPrice) * item.quantity : 0;
    //     totalDiscountForCart += itemDiscount;
    // });

    // cart.discounts = totalDiscountForCart;

    // // Calculate total after discount for cart
    // const totalAfterDiscountForCart = cart.subTotal - totalDiscountForCart;

    // // Calculate cart total
    // cart.cartTotal = totalAfterDiscountForCart;

    // // Save the cart
    // await cart.save();

    res.status(201).json(new ApiResponse(201, order, "Order placed successfully"));
});


const trackOrder = asyncHandler(async (req, res) => {
    const { orderId, deliveryEmail } = req.body

    if (!orderId || !deliveryEmail) {
        throw new ApiError(400, "Please provide the required fields")
    }

    const order = await Order.findById(orderId).lean().select("-paymentInfo")

    if (!order) {
        throw new ApiError(404, "Cannot found that order")
    }

    const profile = await Profile.findOne({ "deliveryAddress.email": deliveryEmail }).lean()

    if (!profile) {
        throw new ApiError(404, "Cannot found the delivery email")
    }

    if (order.orderedBy.toString() !== profile.userId.toString()) {
        throw new ApiError(403, "Email does not match the order owner")
    }

    res.status(201).json(
        new ApiResponse(200, order, "Tracking order by id is successful")
    )
})


const getAllOrder = asyncHandler(async (req, res) => {
    const search = req.query.search || "";
    const orderStatus = req.query.orderStatus || ""
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.aggregate([
        {
            $unwind: "$orderItems"
        },
        {
            $lookup: {
                from: "products",
                localField: "orderItems.productId",
                foreignField: "_id",
                as: "products"
            }
        },
        {
            $unwind: "$products"
        },
        {
            $match: {
                "products.title": { $regex: search, $options: "i" },
            }
        },
        {
            $group: {
                _id: "$_id",
                orderedBy: { $first: "$orderedBy" },
                orderItems: {
                    $push: {
                        productId: "$orderItems.productId",
                        quantity: "$orderItems.quantity",
                        price: "$orderItems.price",
                        productName: "$products.title",
                        productImage: "$products.productImage"
                    }
                },
                shipping: { $first: "$shipping" },
                tax: { $first: "$tax" },
                discount: { $first: "$discount" },
                subTotal: { $first: "$subTotal" },
                totalPrice: { $first: "$totalPrice" },
                deliveryAddress: { $first: "$deliveryAddress" },
                orderStatus: { $first: "$orderStatus" },
                paymentMethod: { $first: "$paymentMethod" },
                createdAt: { $first: "$createdAt" }
            }
        },
        {
            $project: {
                orderedBy: 1,
                orderItems: 1,
                shipping: 1,
                tax: 1,
                discount: 1,
                subTotal: 1,
                totalPrice: 1,
                deliveryAddress: 1,
                orderStatus: 1,
                paymentMethod: 1,
                createdAt: 1
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ]);

    if (!orders || orders.length === 0) {
        throw new ApiError(404, "No orders available");
    }

    const totalOrders = await Order.countDocuments();
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json(
        new ApiResponse(200, { orders, page, totalPages, totalOrders }, "You got all orders successfully")
    );
});


const getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    if (!orderId) {
        throw new ApiError(400, "Please provide the orderId");
    }

    const order = await Order.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(orderId) }
        },
        {
            $unwind: "$orderItems"
        },
        {
            $lookup: {
                from: "profiles",
                localField: "orderedBy",
                foreignField: "userId",
                as: "profile"
            }
        },
        {
            $unwind: "$profile"
        },
        {
            $lookup: {
                from: "products",
                localField: "orderItems.productId",
                foreignField: "_id",
                as: "product"
            }
        },
        {
            $unwind: "$orderItems"
        },
        {
            $unwind: "$product"
        },
        {
            $addFields: {
                "orderItems.productName": "$product.title",
                "orderItems.productImage": "$product.productImage",
                "deliveryAddress": {
                    $arrayElemAt: [
                        {
                            $filter: {
                                input: "$profile.deliveryAddress",
                                as: "address",
                                cond: { $eq: ["$$address._id", { $toObjectId: "$deliveryAddress" }] }
                            }
                        },
                        0
                    ]
                }
            }
        },
        {
            $group: {
                _id: "$_id",
                orderedBy: { $first: "$orderedBy" },
                orderItems: { $push: "$orderItems" },
                shipping: { $first: "$shipping" },
                tax: { $first: "$tax" },
                discount: { $first: "$discount" },
                subTotal: { $first: "$subTotal" },
                totalPrice: { $first: "$totalPrice" },
                deliveryAddress: { $first: "$deliveryAddress" },
                paymentMethod: { $first: "$paymentMethod" },
                orderStatus: { $first: "$orderStatus" },
                createdAt: { $first: "$createdAt" }
            }
        },
    ]);

    if (!order || order.length === 0) {
        throw new ApiError(404, "Cannot find the order by id");
    }

    res.status(200).json(
        new ApiResponse(200, order[0], "You get the order by its Id successfully")
    );
});


const updateOrderById = asyncHandler(async (req, res) => {

    const { orderId } = req.params
    const { orderStatus } = req.body

    console.log(orderId, orderStatus)

    if (!orderId) {
        throw new ApiError(400, "Please give the orderId")
    }

    if (!orderStatus) {
        throw new ApiError(400, "PLease provide the order status")
    }

    const order = await Order.findByIdAndUpdate(orderId, {
        $set: {
            orderStatus
        }
    }, { new: true })

    if (!order) {
        throw new ApiError(404, "Cannot found the order for updation")
    }

    res.status(201).json(
        new ApiResponse(200, order, "The order is updated successfully")
    )


})


const deleteOrderById = asyncHandler(async (req, res) => {

    const { orderId } = req.params

    if (!orderId) {
        throw new ApiError(400, "Please give order id in for the order deletion")
    }

    const order = await Order.findByIdAndDelete(orderId)

    res.status(201).json(
        new ApiResponse(200, order, "The order deleted successfully")
    )
})


const getUserOrder = asyncHandler(async (req, res) => {
    const { _id: orderedBy } = req.user;
    const { orderId } = req.query

    if (!orderedBy) {
        throw new ApiError(500, "Please provide the user id");
    }

    if (!orderId) {
        throw new ApiError(500, "Please provide the order id")
    }

    const userOrder = await Order.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(orderId),
                orderedBy: new mongoose.Types.ObjectId(orderedBy)
            }
        },
        {
            $lookup: {
                from: "profiles",
                localField: "orderedBy",
                foreignField: "userId",
                as: "profile",
            }
        },
        {
            $unwind: {
                path: "$profile",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: "$orderItems"
        },
        {
            $lookup: {
                from: "products",
                localField: "orderItems.productId",
                foreignField: "_id",
                as: "product"
            }
        },
        {
            $unwind: "$product"
        },
        {
            $addFields: {
                "orderItems.productName": "$product.title",
                "orderItems.productImage": "$product.productImage"
            }
        },
        {
            $group: {
                _id: "$_id",
                orderedBy: { $first: "$orderedBy" },
                orderItems: { $push: "$orderItems" },
                shipping: { $first: "$shipping" },
                tax: { $first: "$tax" },
                discount: { $first: "$discount" },
                subTotal: { $first: "$subTotal" },
                totalPrice: { $first: "$totalPrice" },
                deliveryAddress: { $first: "$profile.deliveryAddress" },
                paymentInfo: { $first: "$paymentInfo" },
                paymentMethod: { $first: "$paymentMethod" },
                orderStatus: { $first: "$orderStatus" },
                createdAt: { $first: "$createdAt" }
            }
        },
        {
            $project: {
                orderedBy: 1,
                orderItems: 1,
                shipping: 1,
                tax: 1,
                discount: 1,
                subTotal: 1,
                totalPrice: 1,
                deliveryAddress: 1,
                paymentInfo: 1,
                paymentMethod: 1,
                orderStatus: 1,
                createdAt: 1
            }
        }
    ]);

    if (!userOrder || userOrder.length === 0) {
        throw new ApiError(400, "Cannot find the user order");
    }

    res.status(200).json(new ApiResponse(200, userOrder, "You get the user order successfully"));
});

const getAllUserOrders = asyncHandler(async (req, res) => {
    const { _id: orderedBy } = req.user

    if (!orderedBy) {
        throw new ApiError(400, "Please provide the user id")
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5

    const skip = (page - 1) * limit

    const userAllOrders = await Order.find({ orderedBy }).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const totalOrders = await Order.countDocuments({ orderedBy })

    res.status(201).json(
        new ApiResponse(200, { userAllOrders, totalOrders, page, totalPages: Math.ceil(totalOrders / limit) }, "You get all the orders of the user sucessfully")
    )
})


const getUserOrderStatistics = asyncHandler(async (req, res) => {

    const { _id: orderedBy } = req.user

    if (!orderedBy) {
        throw new ApiError(400, "Please provide the userId")
    }

    const stats = await Order.aggregate([
        {
            $match: { orderedBy: new mongoose.Types.ObjectId(orderedBy) }
        },
        {
            $facet: {
                totalOrders: [{ $count: "total" }],
                pendingOrders: [
                    { $match: { orderStatus: OrderStatus.PENDING } },
                    { $count: "total" }
                ],
                completedOrders: [
                    { $match: { orderStatus: OrderStatus.COMPLETED } },
                    { $count: "total" }
                ]
            },
        },
        {
            $project: {
                totalOrders: { $arrayElemAt: ["$totalOrders.total", 0] },
                pendingOrders: { $arrayElemAt: ["$pendingOrders.total", 0] },
                completedOrders: { $arrayElemAt: ["$completedOrders.total", 0] }
            }
        }
    ])

    res.status(201).json(
        new ApiResponse(200, stats[0], "You get user order statistics successfully")
    )
})


const orderStatistics = asyncHandler(async (req, res) => {

    const order = await Order.aggregate([
        {
            $facet: {
                totalOrders: [
                    { $unwind: "$orderItems" },
                    { $group: { _id: null, totalOrders: { $sum: "$orderItems.quantity" } } }
                ],
                totalIncome: [
                    { $group: { _id: null, totalIncome: { $sum: "$totalPrice" } } }
                ],
                salesByMonth: [
                    {
                        $group: {
                            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                            numberOfSales: { $sum: 1 },
                            totalSalesAmount: { $sum: "$totalPrice" } // Total sales amount per month
                        }
                    },
                    { $sort: { "_id.year": -1, "_id.month": -1 } }
                ],
            }
        }
    ])

    const totalUsers = await User.countDocuments({});

    const totalOrders = order[0].totalOrders[0]?.totalOrders || 0;
    const totalIncome = order[0].totalIncome[0]?.totalIncome || 0;
    const salesByMonth = order[0].salesByMonth || []

    res.status(201).json(
        new ApiResponse(200, { totalOrders, totalIncome, totalUsers, salesByMonth }, "You get the order statistics successfully")
    )
})

const topStatesBySales = asyncHandler(async (req, res) => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const topSales = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: lastMonth } // Filter orders from the last month
            }
        },
        {
            $lookup: {
                from: "profiles",
                localField: "orderedBy",
                foreignField: "userId",
                as: "profile"
            },
        },
        {
            $unwind: "$profile"
        },
        {
            $addFields: {
                deliveryAddress: {
                    $arrayElemAt: [
                        {
                            $filter: {
                                input: "$profile.deliveryAddress",
                                as: "address",
                                cond: { $eq: ["$$address._id", { $toObjectId: "$deliveryAddress" }] }
                            }
                        }, 0
                    ]
                }
            }
        },
        {
            $group: {
                _id: "$deliveryAddress.state",
                totalSalesByState: { $sum: "$totalPrice" },
                numberOfSales: { $sum: 1 }
            }
        },
        {
            $sort: {
                totalSalesByState: -1
            }
        },
        {
            $group: {
                _id: null,
                states: { $push: { state: "$_id", totalSalesByState: "$totalSalesByState", numberOfSales: "$numberOfSales" } },
                totalSales: { $sum: "$totalSalesByState" }
            }
        },
        {
            $project: {
                _id: 0,
                states: 1,
                totalSales: 1
            }
        }
    ]);

    res.status(200).json(
        new ApiResponse(200, topSales[0], "You get the top sales by states successfully")
    );
});


const topProducts = asyncHandler(async (req, res) => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const topProducts = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: lastMonth } // Filter orders from the last month
            }
        },
        // Unwind to break apart the order items
        {
            $unwind: "$orderItems"
        },
        // Group by product to get the top products by sales
        {
            $group: {
                _id: "$orderItems.productId",
                productSales: { $sum: "$orderItems.price" },
                productQuantitySold: { $sum: "$orderItems.quantity" }
            }
        },
        {
            $sort: {
                productSales: -1
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        {
            $unwind: "$productDetails"
        },
        {
            $project: {
                _id: 0,
                productId: "$_id",
                productName: "$productDetails.title",
                productImage: "$productDetails.productImage",
                productSales: 1,
                productQuantitySold: 1
            }
        }
    ]);

    res.status(201).json(
        new ApiResponse(200, topProducts, "You got top products successfully")
    );
});





export { addOrder, getAllOrder, getOrderById, updateOrderById, deleteOrderById, getUserOrder, getUserOrderStatistics, getAllUserOrders, trackOrder, orderStatistics, topStatesBySales, topProducts };
