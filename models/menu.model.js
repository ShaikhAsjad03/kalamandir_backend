const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    sort_order_no: {
      type: Number,
      trim: true,
      index: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "menu",
      default: null,
      index: true,
    },
    cmsId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "cms",
      default: null,
      index: true,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "brand",
      default: null,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "product_category",
      default: null,
      index: true,
    },
    menuType: {
      type: String,
      trim: true,
      index: true,
    },
    menuName: {
      type: String,
      trim: true,
    },
    menuURL: {
      type: String,
      trim: true,
      index: true,
    },
    metaTitle: {
      type: String,
      trim: true,
    },
    metakeyword: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    subMenuCount: {
      type: Number,
    },
    submenuImages: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    showInHeader: {
      type: Boolean,
      default: true,
    },
    showInFooter: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

menuSchema.virtual("submenu", {
  ref: "menu",
  localField: "_id",
  foreignField: "parentId",
  justOne: false,
});
module.exports = mongoose.model("menu", menuSchema);
