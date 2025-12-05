const bannersSchema = require("../models/banner.model");
const menuSchema = require("../models/menu.model");
const fs = require("fs");
const path = require("path");
const { deleteImage, slugify } = require("../helpers/common");

exports.createBanner = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).send({
        isSuccess: false,
        message: req.fileValidationError,
      });
    }

    const {
      sort_order_no,
      menuId,
      bannerType,
      bannerTitle,
      description,
      isActive,
    } = req.body;



    const createObj = {
      sort_order_no,
      menuId,
      bannerType,
      bannerTitle,
      description,
      isActive,
    };

    const desktopFile = req.files?.find(
      (file) => file.fieldname === "desktopImage"
    );
    if (desktopFile) {
      createObj.desktopImage = "banner/desktop/" + desktopFile.filename;
    }

    const mobileFile = req.files?.find(
      (file) => file.fieldname === "mobileImage"
    );
    if (mobileFile) {
      createObj.mobileImage = "banner/mobile/" + mobileFile.filename;
    }

    const saveData = new bannersSchema(createObj);
    await saveData.save();

    return res.status(200).send({
      isSuccess: true,
      message: "Banner Added successfully.",
      data: saveData,
    });
  } catch (error) {
    
    if (error.code === 11000 && error.keyPattern?.slug) {
      return res.status(400).send({
        isSuccess: false,
        message: "A banner for this page already exists.",
      });
    }

    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).send({
        isSuccess: false,
        message: req.fileValidationError,
      });
    }
    const {
      banner_id,
      sort_order_no,
      menuId,
      bannerType,
      bannerTitle,
      description,
      isActive,
    } = req.body;

    const findData = await bannersSchema.findById(banner_id);
    if (!findData) {
      return res.status(404).send({
        message: "Banner with this id not found!",
        isSuccess: false,
      });
    }


    const updateObj = {
      sort_order_no,
      menuId,
      bannerType,
      bannerTitle,
      description,
      isActive,
    };

    const desktopFile = req.files?.find(
      (file) => file.fieldname === "desktopImage"
    );
    if (desktopFile) {
      const newDesktopImage = "banner/desktop/" + desktopFile.filename;
      if (findData.desktopImage) {
        deleteImage(findData.desktopImage);
      }
      updateObj.desktopImage = newDesktopImage;
    }

    const mobileFile = req.files?.find(
      (file) => file.fieldname === "mobileImage"
    );
    if (mobileFile) {
      const newMobileImage = "banner/mobile/" + mobileFile.filename;
      if (findData.mobileImage) {
        await deleteImage(findData.mobileImage);
      }
      updateObj.mobileImage = newMobileImage;
    }

    const updated = await bannersSchema.findByIdAndUpdate(
      banner_id,
      updateObj,
      {
        new: true,
      }
    );

    return res.status(200).send({
      isSuccess: true,
      message: "Banner updated successfully.",
      data: updated,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { banner_id } = req.body;

    const data = await bannersSchema.findByIdAndDelete(banner_id);
    if (!data) {
      return res
        .status(404)
        .send({ message: "Banner with this id not found!", isSuccess: false });
    }

    if (data.desktopImage) {
      await deleteImage(data.desktopImage);
    }

    if (data.mobileImage) {
      await deleteImage(data.mobileImage);
    }

    return res.status(200).send({
      isSuccess: true,
      message: "Banner deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.getAllBanners = async (req, res) => {
  try {
    const pageName = req.params.slug;
    const menu = await menuSchema.findOne({ menuURL: pageName, isActive: true }).lean();

    if (!menu) {
      return res.status(404).send({
        isSuccess: false,
        message: `No menu found for page: ${pageName}`,
        data: [],
      });
    }
    const banners = await bannersSchema
      .find({ menuId: menu._id, isActive: true })
      .sort({ sort_order_no: 1 })
      .lean();

    if (!banners || banners.length === 0) {
      return res.status(404).send({
        isSuccess: false,
        message: `No banners found for menu: ${menu.menuName}`,
        data: [],
      });
    }
    return res.status(200).send({
      isSuccess: true,
      message: "Banners listed successfully.",
      data: banners,
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
    const banner_id = req.body.banner_id;
    const getData = await bannersSchema
      .findById(banner_id)
      .populate("menuId", "menuName")
      .lean();

    if (!getData) {
      return res.status(404).send({
        isSuccess: false,
        message: "Banners with this id not found!",
      });
    }



    return res.status(200).send({
      isSuccess: true,
      message: "Banners listed successfully.",
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

    const getData = await bannersSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit)
      .populate("menuId", "menuName")
      .lean();



    const totalRecords = await bannersSchema.countDocuments();

    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Banners listed successfully.",
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
    const lastSortOrderItem = await bannersSchema
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
