const mongoose = require("mongoose");
const homeBannerBottomSchema = new mongoose.Schema(
  {
    banner_top_title: {
      type: String,
      trim: true,
    },
     banner_bottom_title: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("homeBannerBottom", homeBannerBottomSchema);
