const mongoose = require("mongoose");

const SchemesSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    linkText: {
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
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("schemes", SchemesSchema);
