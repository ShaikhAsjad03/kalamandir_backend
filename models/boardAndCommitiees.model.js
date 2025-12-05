const mongoose = require("mongoose");

const boardAndCommitteesSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    committeeName: {
      type: String,
      trim: true,
    },
    committeeDoc: {
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

module.exports = mongoose.model(
  "board_and_committees",
  boardAndCommitteesSchema
);
