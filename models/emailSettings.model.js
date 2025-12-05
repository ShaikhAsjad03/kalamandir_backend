const mongoose = require("mongoose");

const emailSettingsSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    host: {
      type: String,
      required: true,
      trim: true,
    },
    port: {
      type: Number,
      required: true,
      trim: true,
    },
    fromEmail: {
      type: String,
      trim: true,
    },
    bccEmail: {
      type: String,
      trim: true,
    },
    ccEmail: {
      type: String,
      trim: true,
    },
    newsLetterSubject: {
      type: String,
    },
    newsLetterTemplate: {
      type: String,
    },
    fromEmailContact: {
      type: String,
      trim: true,
    },
    bccEmailContact: {
      type: String,
      trim: true,
    },
    ccEmailContact: {
      type: String,
      trim: true,
    },
    contactSubject: {
      type: String,
    },
    contactTemplate: {
      type: String,
    },
    fromEmailProductInquiry: {
      type: String,
      trim: true,
    },
    bccEmailProductInquiry: {
      type: String,
      trim: true,
    },
    ccEmailProductInquiry: {
      type: String,
      trim: true,
    },
    productInquirySubject: {
      type: String,
    },
    productInquiryTemplate: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("email_settings", emailSettingsSchema);
