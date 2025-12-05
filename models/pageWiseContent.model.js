const { required } = require("joi");
const mongoose = require("mongoose");

const pageWiseContentSchema = new mongoose.Schema(
  {
    page_name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      trim: true,
      index: true,
    },
     title: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },
    
    
    description: {
      type: String,
      trim: true,
      index: true,
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

module.exports = mongoose.model("page_wise_content", pageWiseContentSchema);
