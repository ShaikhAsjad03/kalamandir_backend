const pageWiseContentSchema = require("../models/pageWiseContent.model");
const Menu = require("../models/menu.model");
const slugify = require("slugify");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

exports.createApi = async (req, res) => {
  try {
    const { page_name, description, images, isActive ,title} = req.body || {};
    const slug =slug?  slugify(slug, { lower: true }): slugify(title, { lower: true });
    const createObj = {
      page_name,
      slug,
      description,
      images: images || [],
      isActive,
      title
    };

    const saveData = new pageWiseContentSchema(createObj);
    await saveData.save();
    return res.status(200).send({
      isSuccess: true,
      message: "Page Wise Content added successfully.",
      data: saveData,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

exports.updateApi = async (req, res) => {
  try {
    const { pageWise_id, page_name, description, images, isActive } =
      req.body || {};

    const findData = await pageWiseContentSchema.findById(pageWise_id);
    if (!findData) {
      return res.status(404).send({
        isSuccess: false,
        message: "Page Wise Content with this id not found!",
      });
    }

  

    const slug = slugify(page_name, { lower: true });

    const newImages = Array.isArray(images)
      ? images.filter((img) => img && img.trim() !== "")
      : [];

    const oldImages = findData.images || [];

    const removedImages = oldImages.filter((oldImg) => !newImages.includes(oldImg));

    for (const imgPath of removedImages) {
      const cleanPath = imgPath.startsWith("/")
        ? imgPath.substring(1)
        : imgPath;

      const fullPath = path.join(__dirname, "../public", cleanPath);
      try {
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch (err) {
       
      }
    }

    const updateObj = {
      page_name,
      slug,
      description,
      images: images || [],
      isActive,
    };

    await pageWiseContentSchema.findByIdAndUpdate(pageWise_id, updateObj, {
      new: true,
    });

    return res.status(200).send({
      isSuccess: true,
      message: "Page Wise Content updated successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

exports.deleteApi = async (req, res) => {
  try {
    const { pageWise_id } = req.body;

    const existPageWiseContent = await pageWiseContentSchema.findById(pageWise_id);
    if (!existPageWiseContent) {
      return res.status(404).send({
        isSuccess: false,
        message: "Page Wise Content with this id not found!",
      });
    }

    const removedImages = existPageWiseContent.images || [];
    for (const imgPath of removedImages) {
      const cleanPath = imgPath.startsWith("/")
        ? imgPath.substring(1)
        : imgPath;

      const fullPath = path.join(__dirname, "../public", cleanPath);
      try {
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch (err) {
      }
    }

    return res.status(200).send({
      isSuccess: true,
      message: "Page Wise Content deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};

exports.getAllApis = async (req, res) => {
  try {
    const getData = await pageWiseContentSchema
      .find({ isActive: true })
      .sort({ createdAt: -1 })
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
    const { pageWise_id } = req.body;
    let data = await pageWiseContentSchema.findById(pageWise_id)

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

    let page = await pageWiseContentSchema
      .findOne({ slug, isActive: true })
      .lean();

    if (!page) {
      return res.status(404).send({
        isSuccess: false,
        message: "Page Content not found",
      });
    }

    

    return res.status(200).send({
      isSuccess: true,
      message: "Page Wise Content fetched successfully",
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

    let getData = await pageWiseContentSchema
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    const totalRecords = await pageWiseContentSchema.countDocuments();
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Page Wise Contents listed successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, isSuccess: false });
  }
};
