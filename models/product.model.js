const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      trim: true,
      index: true,
    },
    productCode: {
      type: String,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    productImage: {
      type: String,
      trim: true,
    },
    productDescription: {
      type: String,
      trim: true,
    },
    netWeight: {
      type: String,
      trim: true,
    },
    grossWeight: {
      type: String,
      trim: true,
    },
    diamondWeight: {
      type: String,
      trim: true,
    },
    otherWeight: {
      type: String,
      trim: true,
    },
    mrp: {
      type: String,
      trim: true,
    },
    approxMrp: {
      type: String,
      trim: true,
    },
    stone: {
      type: String,
      trim: true,
    },
    dailyGoldRate: {
      type: String,
      trim: true,
    },
    ProductThumImg: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    metal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "metal",
      index: true,
      default: null,
    },
    gender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "gender",
      index: true,
    },
    collection: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "collection",
        index: true,
      },
    ],
    categoryId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product_category",
        index: true,
      },
    ],
    brandId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brand",
        index: true,
      },
    ],
    metaTitle: {
      type: String,
      trim: true,
    },
    metaKeywords: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("product", productSchema);
