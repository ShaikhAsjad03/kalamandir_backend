const mongoose = require("mongoose");

const goldRateSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    rate18K: {
      type: String,
      trim: true,
    },
    rate22K: {
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

module.exports = mongoose.model("gold_rate", goldRateSchema);
