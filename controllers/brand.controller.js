const brandsSchema = require("../models/brand.model");
const menuSchema = require("../models/menu.model");
const productSchema = require("../models/product.model");
const slugify = require("slugify");
const mongoose = require("mongoose");
const { deleteImage } = require("../helpers/common");
exports.createApi = async (req, res) => {
  try {
    let { sort_order_no, parent_Id, description, isActive, name, slug } =
      req.body;
    if (!parent_Id || parent_Id === "null") parent_Id = null;
    slug ? (slug = slugify(slug, { lower: true })) : (slug = "");

    const createObj = {
      sort_order_no,
      parent_Id,
      description,
      isActive,
      name,
      slug,
    };
    if (req.files) {
      if (req.files.logoImage && req.files.logoImage.length > 0) {
        createObj.logoImage = "mainBrand/" + req.files.logoImage[0].filename;
      }
      if (req.files.categoryImage && req.files.categoryImage.length > 0) {
        createObj.categoryImage =
          "mainBrand/" + req.files.categoryImage[0].filename;
      }
      if (req.files.boxImage && req.files.boxImage.length > 0) {
        createObj.boxImage = "mainBrand/" + req.files.boxImage[0].filename;
      }
    }

    const saveData = await brandsSchema(createObj);
    await saveData
      .save()
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Brand Added successfully.",
          data: data,
        });
      })
      .catch((error) => {
        return res.status(500).send({
          message: error.message,
          isSuccess: false,
        });
      });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
exports.updateApi = async (req, res) => {
  try {
    let { id, sort_order_no, parent_Id, description, isActive, name, slug } =
      req.body;
    if (!parent_Id || parent_Id === "null") parent_Id = null;
    slug = slug ? slugify(slug, { lower: true }) : "";

    const findData = await brandsSchema.findById(id);
    if (!findData) {
      return res.status(200).send({
        message: "Brand with this id not found!",
        isSuccess: false,
      });
    }

    const updateObj = {
      sort_order_no,
      parent_Id,
      description,
      isActive,
      slug,
      name,
    };

    if (req.files) {
      if (req.files.logoImage?.length > 0) {
        if (findData.logoImage) await deleteImage(findData.logoImage);
        updateObj.logoImage = "mainBrand/" + req.files.logoImage[0].filename;
      }

      if (req.files.categoryImage?.length > 0) {
        if (findData.categoryImage) await deleteImage(findData.categoryImage);
        updateObj.categoryImage =
          "mainBrand/" + req.files.categoryImage[0].filename;
      }

      if (req.files.boxImage?.length > 0) {
        if (findData.boxImage) await deleteImage(findData.boxImage);
        updateObj.boxImage = "mainBrand/" + req.files.boxImage[0].filename;
      }
    }

    await brandsSchema.findByIdAndUpdate(id, updateObj, { new: true });

    return res.status(200).send({
      isSuccess: true,
      message: "Brand updated successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
exports.deleteApi = async (req, res) => {
  try {
    const brand_id = req.body.brand_id;
    let existBrand = await brandsSchema.findById({ _id: brand_id });
    if (!existBrand) {
      return res.status(404).send({
        message: "Brand with this id not found!",
        isSuccess: false,
      });
    }

    const productCount = await productSchema.countDocuments({
      brandId: brand_id,
    });
    const subBrandCount = await brandsSchema.countDocuments({
      parent_Id: brand_id,
    });
    if (productCount > 0 && subBrandCount > 0) {
      return res.status(400).json({
        isSuccess: false,
        message: `Cannot delete this brand — it has ${productCount} products and ${subBrandCount} sub-brands. You can freeze it instead.`,
      });
    } else if (productCount > 0) {
      return res.status(400).json({
        isSuccess: false,
        message: `Cannot delete this brand — it has ${productCount} products linked. You can freeze it instead.`,
      });
    } else if (subBrandCount > 0) {
      return res.status(400).json({
        isSuccess: false,
        message: `Cannot delete this brand — it has ${subBrandCount} sub-brands linked. You can freeze it instead.`,
      });
    }

    await brandsSchema
      .findByIdAndDelete(brand_id)
      .then(async (data) => {
        if (data.logoImage || data.categoryImage || data.boxImage) {
          await deleteImage(data.mainBrandImage);
          await deleteImage(data.categoryImage);
          await deleteImage(data.logoImage);
        }

        return res.status(200).send({
          isSuccess: true,
          message: "Brand deleted successfully.",
        });
      })
      .catch((error) => {
        return res.status(500).send({
          message: error.message,
          isSuccess: false,
        });
      });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
exports.getDataById = async (req, res) => {
  try {
    const brand_id = req.body.brand_id;
    const getData = await brandsSchema.findById(brand_id);
    if (!getData) {
      return res.status(404).send({
        isSuccess: false,
        message: "Brand with this id not found!",
      });
    }
    return res.status(200).send({
      isSuccess: true,
      message: "Brand listed successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
exports.getPaginationData = async (req, res) => {
  try {
    let { page = 1, limit = 10, parent_Id } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    const skip = (page - 1) * limit;
    let matchParentId;
    if (!parent_Id || parent_Id === "null") {
      matchParentId = null;
    } else {
      matchParentId = new mongoose.Types.ObjectId(parent_Id);
    }

    const totalRecords = await brandsSchema.countDocuments({
      parent_Id: matchParentId,
    });
    const brands = await brandsSchema.aggregate([
      { $match: { parent_Id: matchParentId } },
      { $sort: { sort_order_no: 1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "brands",
          localField: "_id",
          foreignField: "parent_Id",
          as: "subBrands",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "brandId",
          as: "products",
        },
      },
      {
        $addFields: {
          subBrandCount: { $size: "$subBrands" },
          productCount: { $size: "$products" },
        },
      },
      { $project: { subBrands: 0, products: 0 } },
    ]);
    if (!brands || brands.length === 0) {
      return res.status(200).send({
        isSuccess: false,
        message: "No brands found.",
        data: [],
        currentPageNo: page,
        totalPages: 0,
        totalRecords: 0,
      });
    }

    return res.status(200).json({
      isSuccess: true,
      message: "Brands listed successfully.",
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      data: brands,
    });
  } catch (error) {
    return res.status(500).send({
      isSuccess: false,
      message: error.message,
    });
  }
};
exports.getLastSrNo = async (req, res) => {
  try {
    const lastSortOrderItem = await brandsSchema
      .findOne()
      .sort({ sort_order_no: -1 });
    return res.status(200).send({
      isSuccess: true,
      data: lastSortOrderItem,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
exports.getAllBrands = async (req, res) => {
  try {
    let { parentId } = req.query;

    let query = { isActive: true };
    if (parentId === "all") {
    } else if (!parentId || parentId === "null") {
      query.parent_Id = null;
    } else {
      query.parent_Id = parentId;
    }

    const brands = await brandsSchema.find(query).sort({ sort_order_no: 1 });

    if (!brands || brands.length === 0) {
      return res.status(200).json({
        isSuccess: false,
        message: "No brands found.",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      message:
        parentId === "all"
          ? "All brands listed successfully."
          : parentId
          ? "Sub-brands listed successfully."
          : "Top-level brands listed successfully.",
      data: brands,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
exports.getBrandsWithProducts = async (req, res) => {
  try {
    const slug = req.params.slug;
    const menu = await menuSchema
      .findOne({ menuURL: slug, isActive: true })
      .select("_id");
    if (!menu) {
      return res.status(200).json({
        isSuccess: false,
        message: "Menu Not Found",
        data: [],
      });
    }

    const brands = await brandsSchema.aggregate([
      { $match: { isActive: true, parent_Id: null } },
      { $sort: { sort_order_no: 1 } },

      {
        $lookup: {
          from: "menus",
          localField: "_id",
          foreignField: "brandId",
          as: "menuData",
        },
      },
      {
        $addFields: {
          menuURL: {
            $ifNull: [{ $arrayElemAt: ["$menuData.menuURL", 0] }, null],
          },
        },
      },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "brandId",
          as: "products",
        },
      },
      {
        $addFields: {
          products: {
            $slice: [
              {
                $map: {
                  input: {
                    $filter: {
                      input: "$products",
                      as: "p",
                      cond: { $eq: ["$$p.isActive", true] },
                    },
                  },
                  as: "p",
                  in: {
                    _id: "$$p._id",
                    productName: "$$p.productName",
                    productCode: "$$p.productCode",
                    slug: "$$p.slug",
                    productImage: "$$p.productImage",
                    ProductThumImg: "$$p.ProductThumImg",
                    mrp: "$$p.mrp",
                    productDescription: "$$p.productDescription",
                    netWeight: "$$p.netWeight",
                  },
                },
              },
              7,
            ],
          },
          productCount: { $size: "$products" },
        },
      },
      {
        $project: {
          name: 1,
          slug: 1,
          sort_order_no: 1,
          logoImage: 1,
          categoryImage: 1,
          boxImage: 1,
          description: 1,
          menuURL: 1,
          products: 1,
          productCount: 1,
        },
      },
    ]);

    return res.status(200).json({
      isSuccess: true,
      message: "Brands listed successfully with products.",
      data: brands,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.getAllSubBrands = async (req, res) => {
  try {
    const { slug } = req.params;

    const menu = await menuSchema
      .findOne({ menuURL: slug, isActive: true })
      .select("brandId");

    if (!menu.brandId) {
      return res.status(200).json({
        isSuccess: false,
        message: "Menu not found or inactive",
        data: [],
      });
    }
    const subBrands = await brandsSchema
      .find({ parent_Id: menu.brandId, isActive: true })
      .select("_id name  parent_Id");

    if (subBrands.length === 0) {
      return res.status(200).json({
        isSuccess: true,
        message: "No SubBrands found for this category.",
        data: [],
      });
    }
    return res.status(200).json({
      isSuccess: true,
      message: "SubBrands fetched successfully.",
      data: subBrands,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
