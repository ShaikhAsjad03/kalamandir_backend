const mongoose = require("mongoose");

const newsLetterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      index: true,
    },
    whatsAppNo: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("news_letter", newsLetterSchema);
