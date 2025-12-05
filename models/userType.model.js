const mongoose = require("mongoose");
const userTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      index: true,
    },
   
  },
  { timestamps: true }
);
module.exports = new mongoose.model("userType", userTypeSchema);