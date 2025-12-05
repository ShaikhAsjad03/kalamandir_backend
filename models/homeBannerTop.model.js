const mongoose = require("mongoose");
const homeBannerTopSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    bannerType: {
      type: String,
      trim: true,
      index: true,
    },
    image: {
      type: String,
      trim: true,
    },
    link: {
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

module.exports = mongoose.model("homeBannerTop", homeBannerTopSchema);
