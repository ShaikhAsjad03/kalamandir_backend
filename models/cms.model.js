const { required } = require("joi");
const mongoose = require("mongoose");

const cmsSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },

    page_title: {
      type: String,
      trim: true,
      required: [true, "Page title is required"],
    },
    page_subtitle: {
      type: String,
      trim: true,
    },
    page_editor: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
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

module.exports = mongoose.model("cms", cmsSchema);
