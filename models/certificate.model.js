const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    certificateImage: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("certificate", certificateSchema);
