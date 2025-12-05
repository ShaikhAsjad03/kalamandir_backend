const CmsSchema = require("../models/cms.model");
const Menu = require("../models/menu.model");
const slugify = require("slugify");
const mongoose = require("mongoose");
exports.createCms = async (req, res) => {
  try {
    const {
      sort_order_no,
      page_title,
      page_subtitle,
      page_editor,
      isActive,
      images,
    } = req.body;
    const createObj = {
      sort_order_no,
      page_title,
      page_subtitle,
      page_editor,
      isActive,
      images: images || [],
    };
    const saveData = new CmsSchema(createObj);
    await saveData.save();
    return res.status(200).send({
      isSuccess: true,
      message: "CMS Page Added successfully.",
      data: saveData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
exports.updateCms = async (req, res) => {
  try {
    const {
      cms_id,
      sort_order_no,
      page_title,
      page_subtitle,
      page_editor,
      isActive,
      images,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(cms_id)) {
      return res.status(400).send({
        isSuccess: false,
        message: "Invalid CMS ID",
      });
    }

    const findData = await CmsSchema.findById(cms_id);
    if (!findData) {
      return res.status(404).send({
        message: "CMS Page with this id not found!",
        isSuccess: false,
      });
    }
    const updateObj = {
      sort_order_no,
      page_title,
      page_subtitle,
      page_editor,
      isActive,
      images: images || [],
    };

    await CmsSchema.findByIdAndUpdate(cms_id, updateObj, { new: true });

    return res.status(200).send({
      isSuccess: true,
      message: "CMS Page updated successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
exports.deleteCms = async (req, res) => {
  try {
    const cms_id = req.body.cms_id;
    if (!mongoose.Types.ObjectId.isValid(cms_id)) {
      return res.status(400).send({
        isSuccess: false,
        message: "Invalid CMS ID",
      });
    }

    const data = await CmsSchema.findById(cms_id);

    if (!data) {
      return res.status(404).send({
        message: "CMS Page with this id not found!",
        isSuccess: false,
      });
    }

    const existCmsInMenu = await Menu.find({ cmsId: cms_id })
    if (existCmsInMenu.length > 0) {
      return res.status(400).send({
        isSuccess: false,
        message: "This data can't be deleted as it is mapped with CMS menu.",
      });
    }
    await CmsSchema.findByIdAndDelete(cms_id);

    return res.status(200).send({
      isSuccess: true,
      message: "CMS Page deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
exports.getAllCms = async (req, res) => {
  try {

    const cmsDocs = await CmsSchema.find({ isActive: true }).sort({
      sort_order_no: 1,
    });
    return res.status(200).send({
      isSuccess: true,
      message: "CMS Pages listed successfully.",
      data: cmsDocs,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
exports.getCMSById = async (req, res) => {
  try {
    const cms_id = req.body.cms_id;

    if (!mongoose.Types.ObjectId.isValid(cms_id)) {
      return res.status(400).send({
        isSuccess: false,
        message: "Invalid CMS ID",
      });
    }

    const getData = await CmsSchema.findById(cms_id);

    if (!getData) {
      return res.status(404).send({
        isSuccess: false,
        message: "CMS Page not found!",
      });
    }

    return res.status(200).send({
      isSuccess: true,
      message: "Get CMS Page successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
exports.getCmsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const menuWithCms = await Menu
      .findOne({ menuURL: slug, isActive: true })
      .select("_id cmsId")
        if (!menuWithCms.cmsId) {
      return res.status(404).send({
        isSuccess: false,
        message: `No CMS content linked to menu: ${menuWithCms.menuName}`,
        data: [],
      });
    }
const getData = await CmsSchema.findById({ _id: menuWithCms.cmsId }).lean();
     return res.status(200).send({
      isSuccess: true,
      message: "CMS page fetched successfully via menu",
      data:getData,
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
    const cms_id = req.body.cms_id;
    const getData = await CmsSchema.findById(cms_id);

    return res.status(200).send({
      isSuccess: true,
      message: "Get CMS Page successfully.",
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
    let { page = 1, limit = 10 } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const skip = (page - 1) * limit;
    let getData = await CmsSchema.find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const totalRecords = await CmsSchema.countDocuments();
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "CMS Pages listed successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
exports.getLastSrNo = async (req, res) => {
  try {
    const lastSortOrderItem = await CmsSchema.findOne().sort({
      sort_order_no: -1,
    });
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

