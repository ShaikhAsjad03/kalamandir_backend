const mongoose = require("mongoose");

const policySchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    policyName: {
      type: String,
      trim: true,
    },
    policyDoc: {
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

module.exports = mongoose.model("policy", policySchema);
