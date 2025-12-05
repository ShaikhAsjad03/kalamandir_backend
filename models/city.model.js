const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: [true, "City name is required"],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      index: true,
    },
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    image: {
      type: String,
      trim: true,
      required: true,
    },
    url: {
      type: String,
      required: false,
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

module.exports = mongoose.model("city", citySchema);
