const mongoose = require("mongoose");

const brandsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Brand slug is required"],
      trim: true,
      index: true,
    },
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    logoImage: {
      type: String,
      trim: true,
    },
    categoryImage: {
      type: String,
      trim: true,
    },
    boxImage: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    parent_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand",
      default: null,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("brand", brandsSchema);
