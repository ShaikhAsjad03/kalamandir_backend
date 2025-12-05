const productSchema = require("../models/product.model");
const { Parser } = require("json2csv");
const mongoose = require("mongoose");
const csv = require("csv-parser");
const fs = require("fs");
const XLSX = require("xlsx");
const unzipper = require("unzipper");
const path = require("path");
const slugify = require("slugify");
const {
  deleteImage,
  checkLinkedDocuments,
  processImage,
  formatPopulate,
} = require("../helpers/common");
const categorySchema = require("../models/category.model");
const brandsSchema = require("../models/brand.model");
const menuSchema = require("../models/menu.model");
exports.createApi = async (req, res) => {
  try {
    const {
      productName,
      productCode,
      slug,
      isActive,
      productDescription,
      netWeight,
      grossWeight,
      diamondWeight,
      otherWeight,
      mrp,
      approxMrp,
      dailyGoldRate,
      stone,
      metal,
      gender,
      categoryId,
      brandId,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = req.body || {};

    if (!productName || !productCode) {
      return res.status(400).send({
        isSuccess: false,
        message: "Product name and code are required!",
      });
    }

    const existing = await productSchema.findOne({ productCode });
    if (existing) {
      return res
        .status(400)
        .send({ isSuccess: false, message: "Product code already exists!" });
    }

    const categoryArr = categoryId ? JSON.parse(categoryId) : [];
    const brandArr = brandId ? JSON.parse(brandId) : [];

    const slugText = slug
      ? slugify(slug, { lower: true })
      : slugify(productName, { lower: true });

    const newProduct = new productSchema({
      productName,
      productCode,
      slug: slugText,
      isActive,
      productDescription,
      netWeight,
      grossWeight,
      diamondWeight,
      otherWeight,
      // price,
      mrp,
      approxMrp,
      dailyGoldRate,
      stone,
      metal: metal || null,
      gender,
      categoryId: categoryArr,
      brandId: brandArr,
      metaTitle,
      metaDescription,
      metaKeywords,
    });
    const imageFile = req.files?.find(
      (file) => file.fieldname === "productImage"
    );
    if (imageFile) {
      try {
        const { originalPath, thumbPath } = await processImage(imageFile);
        newProduct.productImage = originalPath;
        newProduct.ProductThumImg = thumbPath;
      } catch (err) {
        return res.status(400).send({ isSuccess: false, message: err.message });
      }
    }

    const saved = await newProduct.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Product created successfully.",
      data: saved,
    });
  } catch (error) {
    return res.status(500).send({ isSuccess: false, message: error.message });
  }
};
exports.updateApi = async (req, res) => {
  try {
    const {
      product_id,
      productName,
      productCode,
      slug,
      isActive,
      productDescription,
      netWeight,
      grossWeight,
      diamondWeight,
      otherWeight,
      mrp,
      approxMrp,
      dailyGoldRate,
      stone,
      metal,
      gender,
      categoryId,
      brandId,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = req.body;

    const product = await productSchema.findById(product_id);
    if (!product) {
      return res.status(404).send({
        isSuccess: false,
        message: "Product not found!",
      });
    }

    const updateObj = {
      productName,
      productCode,
      slug: slug
        ? slugify(slug, { lower: true })
        : slugify(productName, { lower: true }),
      isActive,
      productDescription,
      netWeight,
      grossWeight,
      diamondWeight,
      otherWeight,
      mrp,
      approxMrp,
      dailyGoldRate,
      stone,
      metal: metal || null,
      gender,
      categoryId: categoryId ? JSON.parse(categoryId) : [],
      brandId: brandId ? JSON.parse(brandId) : [],
      metaTitle,
      metaDescription,
      metaKeywords,
    };
    const imageFile = req.files?.find(
      (file) => file.fieldname === "productImage"
    );

    if (imageFile) {
      if (product.productImage) await deleteImage(product.productImage);
      if (product.ProductThumImg) await deleteImage(product.ProductThumImg);

      const { originalPath, thumbPath } = await processImage(imageFile);

      updateObj.productImage = originalPath;
      updateObj.ProductThumImg = thumbPath;
    } else {
      const existingOriginal = path.join("public", product.productImage);
      const fakeFileObject = {
        originalname: path.basename(existingOriginal),
        filename: path.basename(existingOriginal),
        path: existingOriginal,
      };

      const { thumbPath } = await processImage(fakeFileObject);

      updateObj.ProductThumImg = thumbPath;
      updateObj.productImage = product.productImage;
    }

    const updated = await productSchema.findByIdAndUpdate(
      product_id,
      updateObj,
      { new: true }
    );

    return res.status(200).send({
      isSuccess: true,
      message: "Product updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.deleteApi = async (req, res) => {
  try {
    const product_id = req.body.product_id;
    const data = await productSchema.findByIdAndDelete(product_id);

    if (!data) {
      return res.status(404).send({
        message: "Product with this id not found!",
        isSuccess: false,
      });
    }

    if (data.productImage) {
      deleteImage(data.productImage);
    }

    if (data.ProductThumImg) {
      deleteImage(data.ProductThumImg);
    }

    return res.status(200).send({
      isSuccess: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.getAllApis = async (req, res) => {
  try {
    const products = await productSchema
      .find()
      .sort({ createdAt: -1 })
      .populate({ path: "brandId", select: "brandName slug" })
      .populate({ path: "categoryId", select: "categoryName slug" })
      .populate({ path: "metal", select: "metal" })
      .populate({ path: "gender", select: "gender" });

    return res.status(200).send({
      isSuccess: true,
      message: "Products fetched successfully.",
      data: products,
    });
  } catch (error) {
    return res.status(500).send({ isSuccess: false, message: error.message });
  }
};
exports.getDataById = async (req, res) => {
  try {
    const { product_id } = req.body;
    const product = await productSchema
      .findById(product_id)
      .populate({ path: "brandId", select: "brandName slug" })
      .populate({ path: "categoryId", select: "categoryName slug" })
      .populate({ path: "metal", select: "metal" })
      .populate({ path: "gender", select: "gender" });

    if (!product) {
      return res
        .status(404)
        .send({ isSuccess: false, message: "Product not found!" });
    }

    return res.status(200).send({
      isSuccess: true,
      message: "Product fetched successfully.",
      data: product,
    });
  } catch (error) {
    return res.status(500).send({ isSuccess: false, message: error.message });
  }
};

exports.getPaginationData = async (req, res) => {
  try {
    let { page = 1, limit = 10, parentId } = req.body;

    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    const skip = (page - 1) * limit;
    if (!parentId) {
      return res.status(400).json({
        isSuccess: false,
        message: "parentId is required",
      });
    }

    const filter = {
      $or: [{ categoryId: parentId }, { brandId: parentId }],
    };
    const [products, totalRecords] = await Promise.all([
      productSchema
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "brandId",
          select: "brandName slug menuId",
        })
        .populate({
          path: "categoryId",
          select: "categoryName slug menuId",
        })
        .lean(),
      productSchema.countDocuments(filter),
    ]);

    return res.status(200).json({
      isSuccess: true,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({ isSuccess: false, message: error.message });
  }
};

exports.getProductsBySlug = async (req, res) => {
  try {
    const {
      slug,
      gender = [],
      metal = [],
      categoryId = [],
      brandId = [],
    } = req.body || {};

    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 40;
    const skip = (page - 1) * limit;
    const menu = await menuSchema
      .findOne({ menuURL: slug, isActive: true })
      .select("brandId categoryId menuName");

    if (!menu) {
      return res.status(404).json({
        isSuccess: false,
        message: "Menu not found or inactive",
      });
    }

    let filterField = null;
    let entityId = null;
    let entityType = "";

    if (menu.categoryId) {
      filterField = "categoryId";
      entityId = menu.categoryId;
      entityType = "category";
    } else if (menu.brandId) {
      filterField = "brandId";
      entityId = menu.brandId;
      entityType = "brand";
    } else {
      return res.status(400).json({
        isSuccess: false,
        message: "Menu not linked with any category or brand",
      });
    }
    const toObjectIdArray = (arr) =>
      Array.isArray(arr)
        ? arr
            .filter((id) => mongoose.Types.ObjectId.isValid(id))
            .map((id) => new mongoose.Types.ObjectId(id))
        : [];
    const metalIds = toObjectIdArray(metal);
    const genderIds = toObjectIdArray(gender);
    const categoryIds = toObjectIdArray(categoryId);
    const brandIds = toObjectIdArray(brandId);
    const finalEntityId =
      Array.isArray(entityId) && entityId.length > 0
        ? entityId.map((id) =>
            mongoose.Types.ObjectId.isValid(id)
              ? new mongoose.Types.ObjectId(id)
              : id
          )
        : mongoose.Types.ObjectId.isValid(entityId)
        ? new mongoose.Types.ObjectId(entityId)
        : entityId;
    const productQuery = { isActive: true };
    if (Array.isArray(finalEntityId)) {
      productQuery[filterField] = { $in: finalEntityId };
    } else {
      productQuery[filterField] = finalEntityId;
    }
    if (genderIds.length > 0) {
      productQuery.gender = { $in: genderIds };
    }
    if (metalIds.length > 0) {
      productQuery.metal = { $in: metalIds };
    }

    if (categoryIds.length > 0) {
      productQuery.categoryId = { $in: categoryIds };
    }

    if (brandIds.length > 0) {
      productQuery.brandId = { $in: brandIds };
    }
    const [totalProducts, products] = await Promise.all([
      productSchema.countDocuments(productQuery),
      productSchema
        .find(productQuery)
        .select(
          "_id productName slug productImage ProductThumImg mrp productDescription netWeight productCode"
        )
        .populate([{ path: "gender", select: "_id gender " }])
        .populate([{ path: "metal", select: "_id metal" }])
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
    ]);
    return res.status(200).json({
      isSuccess: true,
      message: `Products fetched successfully for ${entityType} menu.`,
      data: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
      },
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.getProductDetailByCode = async (req, res) => {
  try {
    const { productCode } = req.params;

    if (!productCode) {
      return res.status(400).send({
        isSuccess: false,
        message: "Product code is required!",
      });
    }
    const product = await productSchema
      .findOne({ productCode, isActive: true })
      .populate([
        { path: "metal", select: "_id name metalName slug" },
        { path: "gender", select: "_id name genderName slug" },
        { path: "categoryId", select: "_id name categoryName slug" },
        { path: "brandId", select: "_id name brandName slug" },
      ])
      .lean();

    if (!product) {
      return res.status(404).send({
        isSuccess: false,
        message: "Product not found!",
      });
    }
    const formattedProduct = {
      id: product._id,
      name: product.productName,
      code: product.productCode,
      slug: product.slug,
      description: product.productDescription,
      images: {
        main: product.productImage || "",
        thumb: product.ProductThumImg || "",
      },
      weight: {
        net: product.netWeight,
        gross: product.grossWeight,
        diamond: product.diamondWeight,
        other: product.otherWeight,
      },
      price: product.price || 0,
      stone: product.stone || "",
      isActive: product.isActive,
      metal: formatPopulate(product.metal),
      gender: formatPopulate(product.gender),
      category: Array.isArray(product.categoryId)
        ? product.categoryId.map((cat) => formatPopulate(cat))
        : [],
      brand: Array.isArray(product.brandId)
        ? product.brandId.map((b) => formatPopulate(b))
        : [],

      seo: {
        title: product.metaTitle || "",
        keywords: product.metaKeywords || "",
        description: product.metaDescription || "",
      },

      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    return res.status(200).send({
      isSuccess: true,
      message: "Product fetched successfully.",
      data: formattedProduct,
    });
  } catch (error) {
    return res.status(500).send({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.getCategoryByCollection = async (req, res) => {
  try {
    const categories = await categorySchema.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: "menus",
          localField: "menuId",
          foreignField: "_id",
          as: "menu",
        },
      },
      {
        $lookup: {
          from: "collections",
          localField: "_id",
          foreignField: "parentId",
          as: "collections",
        },
      },
      {
        $project: {
          _id: 1,
          categoryName: { $arrayElemAt: ["$menu.menuName", 0] },
          collections: { _id: 1, collectionName: 1 },
        },
      },
      { $sort: { sort_order_no: 1 } },
    ]);

    const brands = await brandsSchema.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: "menus",
          localField: "menuId",
          foreignField: "_id",
          as: "menu",
        },
      },
      // {
      //   $lookup: {
      //     from: "sub_brands",
      //     localField: "_id",
      //     foreignField: "brandId",
      //     as: "subBrands",
      //   },
      // },
      {
        $project: {
          _id: 1,
          brandName: { $arrayElemAt: ["$menu.menuName", 0] },
          // subBrands: { _id: 1, subBrandName: 1 },
        },
      },
      { $sort: { sort_order_no: 1 } },
    ]);
    return res.status(200).send({
      isSuccess: true,
      message: "Categories and Brands fetched successfully",
      data: { categories, brands },
    });
  } catch (error) {
    return res.status(500).send({ isSuccess: false, message: error.message });
  }
};

exports.getCollectionBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        isSuccess: false,
        message: "Slug is required!",
      });
    }

    let result = null;
    let type = "";
    let parentName = "";

    const category = await categorySchema
      .findOne({ slug })
      .populate("menuId", "menuName")
      .select("menuId slug");

    if (category) {
      type = "category";
      parentName = category.menuId ? category.menuId.menuName : "Unknown";
      result = {
        type,
        parentId: category._id,
        parentName,
        slug: category.slug,
      };
    }

    if (!result) {
      const brand = await brandsSchema
        .findOne({ slug })
        .populate("menuId", "menuName")
        .select("menuId slug");

      if (brand) {
        type = "brand";
        parentName = brand.menuId ? brand.menuId.menuName : "Unknown";

        result = {
          type,
          parentId: brand._id,
          parentName,
          slug: brand.slug,
        };
      }
    }

    if (!result) {
      return res.status(404).json({
        isSuccess: false,
        message: "No matching category or brand found for given slug!",
      });
    }
    return res.status(200).json({
      isSuccess: true,
      message:
        type === "category"
          ? "Collections fetched successfully."
          : "Sub-brands fetched successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
