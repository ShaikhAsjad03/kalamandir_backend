const pageWisefaqSchema = require("../models/pageWiseFAQ.model");
const Menu = require("../models/menu.model");
const slugify = require("slugify");
const mongoose = require("mongoose");

exports.createApi = async (req, res) => {
  try {
    const { sort_order_no, page_name, faqQuestion, faqAnswer, isActive } =
      req.body || {};
    const createObj = {
      sort_order_no,
      page_name,
      faqQuestion,
      faqAnswer,
      isActive,
    };

    const saveData = new pageWisefaqSchema(createObj);
    await saveData.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Page Wise FAQ added successfully.",
      data: saveData,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

exports.updateApi = async (req, res) => {
  try {
    const {
      pageWiseFaq_id,
      sort_order_no,
      page_name,
      faqQuestion,
      faqAnswer,
      isActive,
    } = req.body || {};

    const findData = await pageWisefaqSchema.findById(pageWiseFaq_id);
    if (!findData) {
      return res.status(404).send({
        isSuccess: false,
        message: "Page Wise FAQ with this id not found!",
      });
    }

   
    

    const updateObj = {
      sort_order_no,
      page_name,
      faqQuestion,
      faqAnswer,
      isActive,
    };

    await pageWisefaqSchema.findByIdAndUpdate(pageWiseFaq_id, updateObj, {
      new: true,
    });

    return res.status(200).send({
      isSuccess: true,
      message: "Page Wise FAQ updated successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

exports.deleteApi = async (req, res) => {
  try {
    const { pageWiseFaq_id } = req.body;

    const data = await pageWisefaqSchema.findByIdAndDelete(pageWiseFaq_id);
    if (!data) {
      return res.status(404).send({
        isSuccess: false,
        message: "Page Wise FAQ with this id not found!",
      });
    }

    return res.status(200).send({
      isSuccess: true,
      message: "Page Wise FAQ deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

exports.getAllApis = async (req, res) => {
  try {
    const getData = await pageWisefaqSchema
      .find({ isActive: true })
      .sort({ sort_order_no: 1 })
      .populate({
        path: "page_name",
        select: "menuName menuType",
        match: { menuType: { $ne: "cms" } },
      });

    return res.status(200).send({
      isSuccess: true,
      message: "Page Wise FAQs listed successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

exports.getDataById = async (req, res) => {
  try {
    const { pageWiseFaq_id } = req.body;
    let data = await pageWisefaqSchema.findById(pageWiseFaq_id).populate({
      path: "page_name",
      select: "menuName menuType",
      match: { menuType: { $ne: "cms" } },
    });

    if (!data) {
      return res.status(404).send({
        isSuccess: false,
        message: "Page Wise FAQ not found",
      });
    }

    return res.status(200).send({
      isSuccess: true,
      message: "Page Wise FAQ fetched successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
exports.getDataBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    let page = await pageWisefaqSchema.find({ page_name:slug, isActive: true }).lean();

    if (!page) {
      return res.status(404).send({
        isSuccess: false,
        message: "Page Wise FAQ not found",
      });
    }

   

    return res.status(200).send({
      isSuccess: true,
      message: "Page Wise FAQ fetched successfully",
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

    let getData = await pageWisefaqSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit)
    const totalRecords = await pageWisefaqSchema.countDocuments();

    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Page Wise FAQs listed successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

exports.getLastSrNo = async (req, res) => {
  try {
    const lastSortOrderItem = await pageWisefaqSchema
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
