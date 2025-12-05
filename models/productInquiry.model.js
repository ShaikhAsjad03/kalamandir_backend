const mongoose = require("mongoose");

const productInquirySchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      trim: true,
    },
    productCode: {
      type: String,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      index: true,
    },
    mobileNo: {
      type: String,
      trim: true,
      index: true,
    },
    inquiry: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("product_inquiry", productInquirySchema);
