const schemesSchema = require("../models/schemes.model");

exports.createScheme = async (req, res) => {
  try {
    const { sort_order_no, title, link, linkText, description, isActive } = req.body;
    const createObj = {
      sort_order_no,
      title,
      link,
      linkText,
      description,
      isActive
    };
    const saveData = await schemesSchema(createObj);
    await saveData
      .save()
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Scheme Added successfully.",
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

exports.updateScheme = async (req, res) => {
  try {
    const { scheme_id, sort_order_no, title, link, linkText, description, isActive } = req.body;

    const findData = await schemesSchema.findById(scheme_id);
    if (!findData) {
      return res.status(200).send({
        message: "Counter with this id not found!",
        isSuccess: false,
      });
    }
    const updateObj = {
      sort_order_no,
      title,
      link,
      linkText,
      description,
      isActive,
    };

    await schemesSchema
      .findByIdAndUpdate(scheme_id, updateObj, { new: true })
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Scheme updated successfully.",
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

exports.deleteScheme = async (req, res) => {
  try {
    const scheme_id = req.body.scheme_id;
    await schemesSchema
      .findByIdAndDelete(scheme_id)
      .then(async (data) => {
        if (!data) {
          return res
            .status(404)
            .send({ message: "Scheme with this id not found!", isSuccess: false });
        }
        return res.status(200).send({
          isSuccess: true,
          message: "Scheme deleted successfully.",
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

exports.getAllSchemes = async (req, res) => {
  try {
    const getData = await schemesSchema
    .find({ isActive: true })
    .sort({ sort_order_no: 1 });
    return res.status(200).send({
      isSuccess: true,
      message: "Schemes listed successfully.",
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
    const scheme_id = req.body.scheme_id;
    const getData = await schemesSchema.findById(scheme_id);
    return res.status(200).send({
      isSuccess: true,
      message: "Get Scheme successfully.",
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
    const getData = await schemesSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await schemesSchema.countDocuments();
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Schemes listed successfully.",
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
    const lastSortOrderItem = await schemesSchema
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
