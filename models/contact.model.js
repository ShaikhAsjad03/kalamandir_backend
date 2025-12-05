const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      index: true,
    },
    contactNo: {
      type: String,
      trim: true,
      index: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    comments: {
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

module.exports = new mongoose.model("contact", contactSchema);
