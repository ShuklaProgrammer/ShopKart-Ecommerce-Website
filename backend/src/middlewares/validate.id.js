import { isValidObjectId } from "mongoose";

import ApiError from "../utils/apiError.js"

export const validateMongoId = (req, res, next) => {
    const {productId} = req.params
    if(!isValidObjectId(productId)){
        throw new ApiError(400, `Invalid ojectId of: ${productId}`)
    }
    next()
}
