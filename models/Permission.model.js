const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema(
  {
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userType",
      required: true,
      index: true,
    },
    pageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "page",
      required: true,
    },
    actionType: [
      {
        type: String,
        required: true,
      },
    ],



    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("permission", PermissionSchema);
