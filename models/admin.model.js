const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      index: true,
    },
    mobileNo: {
      type: String,
      trim: true,
      index: true,
    },
    whatsappNo: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    stringPassword: {
      type: String,
      trim: true,
    },
    otpCode: {
      type: Number,
      default: null,
    },
    otpExpireIn: {
      type: Number,
      default: null,
    },
    userType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userType",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("admin", adminSchema);
