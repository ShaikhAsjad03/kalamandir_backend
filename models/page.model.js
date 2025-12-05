const mongoose = require("mongoose");
const pageSchema = new mongoose.Schema(
  {
    pageName: {
      type: String,
      trim: true,
      index: true,
    },
    action:[{
      type:String,
      trim:true
    }],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);
module.exports = new mongoose.model("page", pageSchema);