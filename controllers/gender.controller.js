const genderSchema = require("../models/gender.model");
const productsSchema = require("../models/product.model");

exports.createApi = async (req, res) => {
  try {
    const { sort_order_no, gender, isActive } = req.body;
    const createObj = {
      sort_order_no,
      gender,
      isActive
    };
    const saveData = await genderSchema(createObj);
    await saveData
      .save()
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Gender Added successfully.",
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
    const { gender_id, sort_order_no, gender, isActive } = req.body;

    const findData = await genderSchema.findById(gender_id);
    if (!findData) {
      return res.status(200).send({
        message: "Gender with this id not found!",
        isSuccess: false,
      });
    }
    const updateObj = {
      sort_order_no,
      gender,
      isActive,
    };

    await genderSchema
      .findByIdAndUpdate(gender_id, updateObj, { new: true })
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Gender updated successfully.",
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
    const gender_id = req.body.gender_id;

    let existGender = await genderSchema.findById({ _id: gender_id });

    if (!existGender) {
      return res.status(404).send({
        message: "Gender with this id not found!",
        isSuccess: false,
      });
    }

    let genderInProduct = await productsSchema.find({ gender: gender_id });
    if (genderInProduct && genderInProduct.length > 0) {
      return res.status(400).send({ isSuccess: false, message: `Could Not Delete Gender Because It is Linked With ${genderInProduct.length} Product But You Can Freeze It` });
    }

    await genderSchema.findOneAndDelete({ _id: gender_id }).then(async (data) => {
      if (!data) {
        return res
          .status(404)
          .send({ message: "Gender with this id not found!", isSuccess: false });
      }
      return res.status(200).send({
        isSuccess: true,
        message: "Gender deleted successfully.",
      });
    }).catch((error) => {
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
    const getData = await genderSchema
    .find({ isActive: true })
    .sort({ sort_order_no: 1 });
    return res.status(200).send({
      isSuccess: true,
      message: "Genders listed successfully.",
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
    const gender_id = req.body.gender_id;
    const getData = await genderSchema.findById(gender_id);
    return res.status(200).send({
      isSuccess: true,
      message: "Get Gender successfully.",
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
    const getData = await genderSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await genderSchema.countDocuments();
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Genders listed successfully.",
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
    const lastSortOrderItem = await genderSchema
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
