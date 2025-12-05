const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
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
      ref: "product_category",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("product_category", categorySchema);
