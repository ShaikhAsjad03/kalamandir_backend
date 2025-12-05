const categorySchema = require("../models/category.model");
const mongoose = require("mongoose");
const productSchema = require("../models/product.model");
const slugify = require("slugify");
const { deleteImage } = require("../helpers/common");
const menuSchema = require("../models/menu.model");

exports.createApi = async (req, res) => {
  try {
    let { sort_order_no, name, description, isActive, parent_id } = req.body;
    if (!parent_id || parent_id === "null") parent_id = null;
    const existingCategory = await categorySchema.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).send({
        isSuccess: false,
        message: "Category name already exists.",
      });
    }
    const createObj = {
      sort_order_no,
      name,
      description,
      parent_Id: parent_id,
      isActive,
    };




    const categoryImageFile = req.files?.categoryImage?.[0];
    if (categoryImageFile) {
      createObj.categoryImage = "category/" + categoryImageFile.filename;
    }

    const boxImageFile = req.files?.boxImage?.[0];
    if (boxImageFile) {
      createObj.boxImageFile = "category/" + boxImageFile.filename;
    }

    const saveData = await categorySchema(createObj);
    await saveData
      .save()
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Category Added successfully.",
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
    let { category_id, sort_order_no, name, description, isActive, parent_id } = req.body;
    if (!parent_id || parent_id === "null") parent_id = null;
    const findData = await categorySchema.findById(category_id);
    if (!findData) {
      return res.status(200).send({
        message: "Category with this id not found!",
        isSuccess: false,
      });
    }

    if (name && name.trim() !== findData.name) {
      const existingCategory = await categorySchema.findOne({ name: name.trim() });
      if (existingCategory) {
        return res.status(400).send({
          isSuccess: false,
          message: "Category name already exists.",
        });
      }
    }

    const updateObj = {
      sort_order_no,
      name,
      description,
      parent_Id: parent_id,
      isActive,
    };

    if (req.files) {


      if (req.files.categoryImage?.length > 0) {
        if (findData.categoryImage) await deleteImage(findData.categoryImage);
        updateObj.categoryImage = "category/" + req.files.categoryImage[0].filename;
      }

      if (req.files.boxImage?.length > 0) {
        if (findData.boxImage) await deleteImage(findData.boxImage);
        updateObj.boxImage = "category/" + req.files.boxImage[0].filename;
      }
    }


    await categorySchema
      .findByIdAndUpdate(category_id, updateObj, { new: true })
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Category updated successfully.",
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
exports.deleteApi = async (req, res) => {
  try {
    const category_id = req.body.category_id;
    let existCategory = await categorySchema.findById({ _id: category_id });

    if (!existCategory) {
      return res.status(404).send({
        message: "Category with this id not found!",
        isSuccess: false,
      });
    }

    const productCount = await productSchema.countDocuments({ categoryId: category_id });

    let existCategoryInProduct = await productSchema.find({ categoryId: { $in: [category_id] } });
    if (existCategoryInProduct.length > 0) {
      return res.status(400).send({ isSuccess: false, message: `Could Not Delete Category Because It is Linked With ${existCategoryInProduct.length} Product But You Can Freeze It` });
    }

    if (!existCategory.parent_Id) {
      const subCategories = await categorySchema.find({ parent_Id: category_id });
      if (subCategories.length > 0) {
        return res.status(400).send({
          isSuccess: false,
          message: `Could not delete category because it has ${subCategories.length} subcategory(ies). Please delete them first.`,
        });
      }
    }


    await categorySchema
      .findByIdAndDelete(category_id)
      .then(async (data) => {
        if (data.categoryImage || data.boxImage) {
          await deleteImage(data.boxImage);
          await deleteImage(data.categoryImage);
        }

        return res.status(200).send({
          isSuccess: true,
          message: "Category deleted successfully.",
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
exports.getAllApis = async (req, res) => {
  try {
    let query = { isActive: true };
    const categories = await categorySchema
      .find(query)
      .sort({ sort_order_no: 1 })
      .populate("menuId", "menuName")
      .lean();

    if (!categories || categories.length === 0) {
      return res.status(404).send({
        isSuccess: false,
        message: "No Category found for this page.",
        data: [],
      });
    }
    const flatData = await Promise.all(
      categories.map(async (category) => {
        const latestProducts = await productSchema
          .find({ categoryId: category._id, isActive: true })
          .sort({ createdAt: -1 })
          .limit(7)
          .populate({ path: "brandId", select: "brandName slug" })
          .populate({ path: "collection", select: "collectionName" })
          .populate({ path: "subBrandId", select: "subBrandName" })
          .populate({ path: "metal", select: "metal" })
          .populate({ path: "gender", select: "gender" })
          .lean();

        return {
          ...category,
          menuId: category.menuId?._id || null,
          menuName: category.menuId?.menuName || "-",
          latestProducts,
          totalProducts: latestProducts.length,
        };
      })
    );

    return res.status(200).send({
      isSuccess: true,
      message: "Categories listed successfully with latest products.",
      total: flatData.length,
      data: flatData,
    });
  } catch (error) {
    return res.status(500).send({
      isSuccess: false,
      message: error.message,
    });
  }
};
exports.getDataById = async (req, res) => {
  try {
    const category_id = req.body.category_id;
    const getData = await categorySchema
      .findById(category_id)
    if (!getData) {
      return res.status(404).send({
        isSuccess: false,
        message: "Category with this id not found!",
      });
    }
    return res.status(200).send({
      isSuccess: true,
      message: "Category listed successfully.",
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
    let { page = 1, limit = 10, parentId } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    const skip = (page - 1) * limit;
    let matchParentId;
    if (!parentId || parentId === "null") {
      matchParentId = null;
    } else {
      matchParentId = new mongoose.Types.ObjectId(parentId);
    }
    const totalRecords = await categorySchema.countDocuments({
      parent_Id: matchParentId,
    });
    const categories = await categorySchema
      .find({ parent_Id: matchParentId })
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    if (!categories || categories.length === 0) {
      return res.status(200).send({
        isSuccess: false,
        message: "No categories found.",
        data: []
      });
    }
    const categoryIds = categories.map((cat) => cat._id);
    const subCategoryCounts = await categorySchema.aggregate([
      { $match: { parent_Id: { $in: categoryIds } } },
      { $group: { _id: "$parent_Id", count: { $sum: 1 } } },
    ]);
    const productCounts = await productSchema.aggregate([
      { $unwind: "$categoryId" },
      { $match: { categoryId: { $in: categoryIds } } },
      { $group: { _id: "$categoryId", count: { $sum: 1 } } },
    ]);

    const subCategoryMap = subCategoryCounts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    const productCountMap = productCounts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});
    const formattedData = categories.map((cat) => ({
      ...cat,
      subCategoryCount: subCategoryMap[cat._id.toString()] || 0,
      productCount: productCountMap[cat._id.toString()] || 0,
    }));
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Categories listed successfully.",
      data: formattedData,
    });
  } catch (error) {
    return res.status(200).send({
      isSuccess: false,
      message: error.message,
      data: []
    });
  }
};
exports.getLastSrNo = async (req, res) => {
  try {
    const lastSortOrderItem = await categorySchema
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

exports.getAllCategory = async (req, res) => {
  try {
    let { parentId } = req.query;
    let query = { isActive: true };
    if (parentId === "all") {

    }
    else if (!parentId || parentId === "null") {
      query.parent_Id = null;
    }
    else {
      query.parent_Id = parentId;
    }

    const category = await categorySchema.find(query).sort({ sort_order_no: 1 });

    if (!category || category.length === 0) {
      return res.status(200).json({
        isSuccess: false,
        message: "No Category found.",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      message:
        parentId === "all"
          ? "All Categories listed successfully."
          : parentId
            ? "Sub-Category listed successfully."
            : "Top-level Category listed successfully.",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.getCategoryWithProducts = async (req, res) => {
  try {
    const slug = req.params.slug;
    const menu = await menuSchema.findOne({ menuURL: slug, isActive: true }).select("_id");
    if (!menu) {
      return res.status(200).json({
        isSuccess: false,
        message: "Menu Not Found",
        data: [],
      });
    }

    const categories = await categorySchema.aggregate([
      {
        $match: { isActive: true, parent_Id: null },
      },
      { $sort: { sort_order_no: 1 } },

        {
    $lookup: {
      from: "menus", 
      localField: "_id",
      foreignField: "categoryId", 
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
          foreignField: "categoryId",
          as: "products",
        },
      },
      {
        $addFields: {
          products: {
            $filter: {
              input: "$products",
              as: "p",
              cond: { $eq: ["$$p.isActive", true] },
            },
          },
        },
      },
      {
        $addFields: {
          products: {
            $slice: [
              {
                $map: {
                  input: "$products",
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
              7
            ],
          },
          productCount: { $size: "$products" },
        },
      },

      {
    $lookup: {
      from: "menus",
      localField: "_id",
      foreignField: "categoryId", 
      as: "menu",
    },
  },
  {
    $addFields: {
      menuUrl: { $arrayElemAt: ["$menu.url", 0] },
    },
  },

  
      {
        $project: {
          name: 1,
          sort_order_no: 1,
          menuURL: 1,
          categoryImage: 1,
          boxImage: 1,
          description: 1,
          products: 1,
          productCount: 1,
        },
      },
    ]);


    return res.status(200).json({
      isSuccess: true,
      message: "Brands listed successfully with products.",
      data: categories,

    });

  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
}

exports.getAllSubCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const menu = await menuSchema
      .findOne({ menuURL: slug, isActive: true })
      .select("categoryId");
    if (!menu.categoryId) {
      return res.status(200).json({
        isSuccess: false,
        message: "Menu not found or inactive",
        data: [],
      });
    }
    const subCategories = await categorySchema
      .find({ parent_Id: menu.categoryId, isActive: true })
      .select("_id name  boxImage parent_Id");

    if (subCategories.length === 0) {
      return res.status(200).json({
        isSuccess: true,
        message: "No subcategories found for this category.",
        data: [],
      });
    }
    return res.status(200).json({
      isSuccess: true,
      message: "Subcategories fetched successfully.",
      data: subCategories,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

