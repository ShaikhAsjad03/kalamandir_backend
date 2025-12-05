const mongoose = require("mongoose");

const websiteSettingSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    emailInfo: {
      type: String,
      required: true,
    },
    emailSupport: {
      type: String,
    },
    contact: {
      type: String,
      required: true,
    },
    whatsappNo: {
      type: String,
      required: true,
    },
    collection_title: {
      type: String,
    },
    socialMedia: [
      {
        name: {
          type: String,
          trim: true,
        },
        link: {
          type: String,
          trim: true,
        },
      },
    ],
    websiteLogo: {
      type: String,
    },
    instagramFeedType: {
      type: String,
      enum: ["Image", "Video", "All"],
      default: "All",
    },
    instagramActive: {
      type: Boolean,
      default: false,
    },
    footerBackgroundImage: {
      type: String,
      default: null,
    },
    footerHeadingTextColor: {
      type: String,
      default: null,
    },
    footerTextColor: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("website_settings", websiteSettingSchema);
