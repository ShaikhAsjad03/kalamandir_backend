const metalSchema = require("../models/metal.model");
const productsSchema = require("../models/product.model");

exports.createApi = async (req, res) => {
  try {
    const { sort_order_no, metal, isActive } = req.body;
    const createObj = {
      sort_order_no,
      metal,
      isActive
    };
    const saveData = await metalSchema(createObj);
    await saveData
      .save()
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Metal Added successfully.",
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
    const { metal_id, sort_order_no, metal, isActive } = req.body;

    const findData = await metalSchema.findById(metal_id);
    if (!findData) {
      return res.status(200).send({
        message: "Metal with this id not found!",
        isSuccess: false,
      });
    }
    const updateObj = {
      sort_order_no,
      metal,
      isActive,
    };

    await metalSchema
      .findByIdAndUpdate(metal_id, updateObj, { new: true })
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Metal updated successfully.",
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
    const metal_id = req.body.metal_id;
    let existMetal = await metalSchema.findById({ _id: metal_id });
    if (!existMetal) {
      return res.status(404).send({
        message: "Metal with this id not found!",
        isSuccess: false,
      });
    }
    let existMetalInProduct = await productsSchema.find({ metal: metal_id });
    if (existMetalInProduct && existMetalInProduct?.length > 0 ) {
      return res.status(400).send({ isSuccess: false, message: `Could Not Delete Metal Because It is Linked With ${existMetalInProduct.length} Product But You Can Freeze It` });
    }

    await metalSchema.findByIdAndDelete(metal_id)

    return res.status(200).send({
      isSuccess: true,
      message: "Metal deleted successfully.",
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
    const getData = await metalSchema
      .find({ isActive: true })
      .sort({ sort_order_no: 1 });
    return res.status(200).send({
      isSuccess: true,
      message: "Metals listed successfully.",
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
    const metal_id = req.body.metal_id;
    const getData = await metalSchema.findById(metal_id);
    return res.status(200).send({
      isSuccess: true,
      message: "Get Metal successfully.",
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
    const getData = await metalSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await metalSchema.countDocuments();
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Metals listed successfully.",
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
    const lastSortOrderItem = await metalSchema
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
