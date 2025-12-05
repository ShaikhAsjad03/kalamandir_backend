const mongoose = require("mongoose");

const homeBannerSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    bannerType: {
      type: String,
      enum: ["image", "video"],
      lowercase: true,
      index: true,
    },
    desktopImage: {
      type: String,
      trim: true,
    },
    mobileImage: {
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

module.exports = mongoose.model("home_banner", homeBannerSchema);
