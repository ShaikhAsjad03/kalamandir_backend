const homeCMSContentSchema = require("../models/homeCMSContent.model");
const Menu = require("../models/menu.model");
const slugify = require("slugify");
const mongoose = require("mongoose");
exports.createApi = async (req, res) => {
  try {
    const { sort_order_no, page_name, title, description, images, isActive,slug } =
      req.body || {};
       const slugs =slug?  slugify(slug, { lower: true }): slugify(title, { lower: true });
    const createObj = {
      sort_order_no,
      page_name,
      slug:slugs,
      title,
      description,
      images: images || [],
      isActive,
    };

    const saveData = new homeCMSContentSchema(createObj);
    await saveData.save();

    return res.status(200).send({
      isSuccess: true,
      message: "Page Content added successfully.",
      data: saveData,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

exports.updateApi = async (req, res) => {
  try {
    const {
      pageContent_id,
      sort_order_no,
      page_name,
      title,
      description,
      images,
      isActive,
      slug
    } = req.body || {};

    const findData = await homeCMSContentSchema.findById(pageContent_id);
    if (!findData) {
      return res.status(404).send({
        isSuccess: false,
        message: "Page Content with this id not found!",
      });
    }

   
const slugs =slug?  slugify(slug, { lower: true }): slugify(title, { lower: true });
    const updateObj = {
      sort_order_no,
      page_name,
      slug:slugs,
      title,
      description,
      images: images || [],
      isActive,
    };

    await homeCMSContentSchema.findByIdAndUpdate(pageContent_id, updateObj, {
      new: true,
    });

    return res.status(200).send({
      isSuccess: true,
      message: "Page Content updated successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

exports.deleteApi = async (req, res) => {
  try {
    const { pageContent_id } = req.body;

    const data = await homeCMSContentSchema.findByIdAndDelete(pageContent_id);
    if (!data) {
      return res.status(404).send({
        isSuccess: false,
        message: "Page Content with this id not found!",
      });
    }

    return res.status(200).send({
      isSuccess: true,
      message: "Page Content deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

exports.getAllApis = async (req, res) => {
  try {
    const { page_name } = req.params;
    const getData = await homeCMSContentSchema.find({ page_name, isActive: true })
    return res.status(200).send({
      isSuccess: true,
      message: "Page Content listed successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

exports.getDataById = async (req, res) => {
  try {
    const { pageContent_id } = req.body;
    let data = await homeCMSContentSchema.findById(pageContent_id).populate({
      path: "page_name",
      select: "menuName menuType",
      match: { menuType: { $ne: "cms" } },
    });

    if (!data) {
      return res.status(404).send({
        isSuccess: false,
        message: "Page Content not found",
      });
    }

    return res.status(200).send({
      isSuccess: true,
      message: "Page Content fetched successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

exports.getDataBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    let page = await homeCMSContentSchema.find({ slug, isActive: true }).lean();

    if (!page) {
      return res.status(404).send({
        isSuccess: false,
        message: "Page Content not found",
      });
    }

    if (mongoose.Types.ObjectId.isValid(page.page_name)) {
      const menu = await Menu.findById(page.page_name)
        .select("menuName menuType")
        .lean();
      if (!menu || menu.menuType === "cms") {
        return res.status(400).send({
          isSuccess: false,
          message: "Invalid page mapping with CMS menu",
        });
      }
      page.page_name = {
        _id: menu._id,
        menuName: menu.menuName,
        menuType: menu.menuType,
      };
    }

    return res.status(200).send({
      isSuccess: true,
      message: "Page Contents fetched successfully",
      data: page,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

exports.getPaginationData = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    let getData = await homeCMSContentSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "page_name",
        select: "menuName menuType",
        match: { menuType: { $ne: "cms" } },
      });

    const totalRecords = await homeCMSContentSchema.countDocuments();

    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Page Contents listed successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

exports.getLastSrNo = async (req, res) => {
  try {
    const lastSortOrderItem = await homeCMSContentSchema
      .findOne()
      .sort({ sort_order_no: -1 });

    return res.status(200).send({
      isSuccess: true,
      data: lastSortOrderItem,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
