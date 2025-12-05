const homeBannerSchema = require("../models/homeBanner.model");
const { deleteImage } = require("../helpers/common");

exports.createApi = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).send({
        isSuccess: false,
        message: req.fileValidationError,
      });
    }
    const { sort_order_no, bannerType, link, isActive } = req.body;

    const createObj = {
      sort_order_no,
      bannerType,
      link,
      isActive,
    };
    const desktopFile = req.files.find(
      (file) => file.fieldname === "desktopImage"
    );
    const desktopImage = desktopFile
      ? "homeBanner/desktop/" + desktopFile.filename
      : "";
    if (desktopImage) {
      createObj.desktopImage = desktopImage;
    }
    const mobileFile = req.files.find(
      (file) => file.fieldname === "mobileImage"
    );
    const mobileImage = mobileFile
      ? "homeBanner/mobile/" + mobileFile.filename
      : "";
    if (mobileImage) {
      createObj.mobileImage = mobileImage;
    }
    const saveData = await homeBannerSchema(createObj);
    await saveData
      .save()
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Home Banner Added successfully.",
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
    if (req.fileValidationError) {
      return res.status(400).send({
        isSuccess: false,
        message: req.fileValidationError,
      });
    }

    const { homeBanner_id, sort_order_no, bannerType, link, isActive } = req.body;

    const findData = await homeBannerSchema.findById(homeBanner_id);
    if (!findData) {
      return res.status(404).send({
        message: "Home Banner with this id not found!",
        isSuccess: false,
      });
    }

    const updateObj = {
      sort_order_no,
      bannerType,
      link,
      isActive,
    };

    const desktopFile = req.files?.find(
      (file) => file.fieldname === "desktopImage"
    );
    if (desktopFile) {
      const newDesktopImage = "homeBanner/desktop/" + desktopFile.filename;
      if (findData.desktopImage) {
        await deleteImage(findData.desktopImage);
      }
      updateObj.desktopImage = newDesktopImage;
    }

    const mobileFile = req.files?.find(
      (file) => file.fieldname === "mobileImage"
    );
    if (mobileFile) {
      const newMobileImage = "homeBanner/mobile/" + mobileFile.filename;
      if (findData.mobileImage) {
        await deleteImage(findData.mobileImage);
      }
      updateObj.mobileImage = newMobileImage;
    }

    const updated = await homeBannerSchema.findByIdAndUpdate(
      homeBanner_id,
      updateObj,
      {
        new: true,
      }
    );

    return res.status(200).send({
      isSuccess: true,
      message: "Home Banner updated successfully.",
      data: updated,
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
    const homeBanner_id = req.body.homeBanner_id;
    await homeBannerSchema
      .findByIdAndDelete(homeBanner_id)
      .then(async (data) => {
        if (!data) {
          return res
            .status(404)
            .send({
              message: "Home Banner with this id not found!",
              isSuccess: false,
            });
        }
        if (data.desktopImage) {
          await deleteImage(data.desktopImage);
        }
        if (data.mobileImage) {
          await deleteImage(data.mobileImage);
        }
        return res.status(200).send({
          isSuccess: true,
          message: "Home Banner deleted successfully.",
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
    const getData = await homeBannerSchema
      .find({ isActive: true })
      .sort({ sort_order_no: 1 });
    return res.status(200).send({
      isSuccess: true,
      message: "Home Banner listed successfully.",
      data: getData,
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
    const homeBanner_id = req.body.homeBanner_id;
    const getData = await homeBannerSchema.findById(homeBanner_id);
    return res.status(200).send({
      isSuccess: true,
      message: "Get Home Banner successfully.",
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
    const getData = await homeBannerSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await homeBannerSchema.countDocuments();
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Home Banner listed successfully.",
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
    const lastSortOrderItem = await homeBannerSchema
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
