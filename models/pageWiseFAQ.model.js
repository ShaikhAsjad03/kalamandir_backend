const mongoose = require("mongoose");

const pageWiseFaqSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    page_name: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      trim: true,
      index: true,
    },
    faqQuestion: {
      type: String,
      trim: true,
    },
    faqAnswer: {
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

module.exports = mongoose.model("page_wise_faq", pageWiseFaqSchema);
