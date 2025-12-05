const mongoose = require("mongoose");

const disclousersSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    disclouserName: {
      type: String,
      trim: true,
    },
    disclouserDoc: {
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

module.exports = mongoose.model("disclouser", disclousersSchema);
