const policySchema = require("../models/policies.model");
const { deleteImage } = require("../helpers/common");

exports.createPolicy = async (req, res) => {
  try {
    const { sort_order_no, policyName, isActive } = req.body;

    const createObj = {
      sort_order_no,
      policyName,
      isActive,
    };
    const docFile = req.files.find((file) => file.fieldname === "policyDoc");
    const policyDoc = docFile ? "policies/" + docFile.filename : "";
    if (policyDoc) {
      createObj.policyDoc = policyDoc;
    }

    const saveData = await policySchema(createObj);
    await saveData
      .save()
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Policy Added Successfully.",
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

exports.updatePolicy = async (req, res) => {
  try {
    const { policy_id, sort_order_no, policyName, isActive } = req.body;

    const findData = await policySchema.findById(policy_id);
    if (!findData) {
      return res.status(200).send({
        message: "Policy with this id not found!",
        isSuccess: false,
      });
    }

    const updateObj = {
      sort_order_no,
      policyName,
      isActive,
    };

    const docFile = req.files.find((file) => file.fieldname === "policyDoc");
    const policyDoc = docFile ? "policies/" + docFile.filename : "";

    if (policyDoc) {
      if (findData.policyDoc) {
        await deleteImage(findData.policyDoc);
      }
      updateObj.policyDoc = policyDoc;
    }

    await policySchema
      .findByIdAndUpdate(policy_id, updateObj, { new: true })
      .then(async () => {
        return res.status(200).send({
          isSuccess: true,
          message: "Policy updated successfully.",
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

exports.deletePolicy = async (req, res) => {
  try {
    const policy_id = req.body.policy_id;
    await policySchema
      .findByIdAndDelete(policy_id)
      .then(async (data) => {
        if (data && data.policyDoc) {
          await deleteImage(data.policyDoc);
        }
        if (!data) {
          return res
            .status(404)
            .send({
              message: "Policy with this id not found!",
              isSuccess: false,
            });
        }
        return res.status(200).send({
          isSuccess: true,
          message: "Policy deleted successfully.",
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

exports.getAllPolicies = async (req, res) => {
  try {
    const getData = await policySchema.find({ isActive: true }).sort({
      sort_order_no: 1,
    });
    return res.status(200).send({
      isSuccess: true,
      message: "Policies listed successfully.",
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
    const policy_id = req.body.policy_id;
    const getData = await policySchema.findById(policy_id);
    return res.status(200).send({
      isSuccess: true,
      message: "Policy fetched successfully.",
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
    const getData = await policySchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await policySchema.countDocuments();
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Policies listed successfully.",
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
    const lastSortOrderItem = await policySchema
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
