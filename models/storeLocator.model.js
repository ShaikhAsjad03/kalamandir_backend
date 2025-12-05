const mongoose = require("mongoose");

const storeLocatorSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    address: {
      type: String,
      trim: true,
    },
    mapIframe: {
      type: String,
      trim: true,
    },
    storeImage: {
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

module.exports = mongoose.model("store_locator", storeLocatorSchema);
