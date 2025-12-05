const mongoose = require("mongoose");

const genderSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("gender", genderSchema);
