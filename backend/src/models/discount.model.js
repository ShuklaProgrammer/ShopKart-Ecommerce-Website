import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    discountName: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    discountType: {
      type: String,
      required: true,
      enum: ["Percentage", "Fixed"],
      trim: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    discountExpiry: {
      type: Date,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

export const Discount = mongoose.model("Discount", discountSchema);
