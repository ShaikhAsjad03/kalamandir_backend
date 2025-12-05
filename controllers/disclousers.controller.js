const disclouserSchema = require("../models/disclousers.model");
const { deleteImage } = require("../helpers/common");

exports.createDisclouser = async (req, res) => {
  try {
    const { sort_order_no, disclouserName, isActive } = req.body;

    const createObj = {
      sort_order_no,
      disclouserName,
      isActive,
    };
    const docFile = req.files.find((file) => file.fieldname === "disclouserDoc");
    const disclouserDoc = docFile ? "disclousers/" + docFile.filename : "";
    if (disclouserDoc) {
      createObj.disclouserDoc = disclouserDoc;
    }

    const saveData = await disclouserSchema(createObj);
    await saveData
      .save()
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Disclouser Added Successfully.",
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

exports.updateDisclouser = async (req, res) => {
  try {
    const { disclouser_id, sort_order_no, disclouserName, isActive } = req.body;

    const findData = await disclouserSchema.findById(disclouser_id);
    if (!findData) {
      return res.status(200).send({
        message: "Disclouser with this id not found!",
        isSuccess: false,
      });
    }

    const updateObj = {
      sort_order_no,
      disclouserName,
      isActive,
    };

    const docFile = req.files.find((file) => file.fieldname === "disclouserDoc");
    const disclouserDoc = docFile ? "disclousers/" + docFile.filename : "";

    if (disclouserDoc) {
      if (findData.disclouserDoc) {
        await deleteImage(findData.disclouserDoc);
      }
      updateObj.disclouserDoc = disclouserDoc;
    }

    await disclouserSchema
      .findByIdAndUpdate(disclouser_id, updateObj, { new: true })
      .then(async () => {
        return res.status(200).send({
          isSuccess: true,
          message: "Disclouser updated successfully.",
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

exports.deleteDisclouser = async (req, res) => {
  try {
    const disclouser_id = req.body.disclouser_id;
    await disclouserSchema
      .findByIdAndDelete(disclouser_id)
      .then(async (data) => {
        if (data && data.disclouserDoc) {
          await deleteImage(data.disclouserDoc);
        }
        if (!data) {
          return res
            .status(404)
            .send({
              message: "Disclouser with this id not found!",
              isSuccess: false,
            });
        }
        return res.status(200).send({
          isSuccess: true,
          message: "Disclouser deleted successfully.",
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

exports.getAllDisclousers = async (req, res) => {
  try {
    const getData = await disclouserSchema.find({ isActive: true }).sort({
      sort_order_no: 1,
    });
    return res.status(200).send({
      isSuccess: true,
      message: "Disclousers listed successfully.",
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
    const disclouser_id = req.body.disclouser_id;
    const getData = await disclouserSchema.findById(disclouser_id);
    return res.status(200).send({
      isSuccess: true,
      message: "Disclouser fetched successfully.",
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
    const getData = await disclouserSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await disclouserSchema.countDocuments();
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Disclousers listed successfully.",
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
    const lastSortOrderItem = await disclouserSchema
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
