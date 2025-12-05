const boardAndCommitteesSchema = require("../models/boardAndCommitiees.model");
const { deleteImage } = require("../helpers/common");

exports.createCommittee = async (req, res) => {
  try {
    const { sort_order_no, committeeName, isActive } = req.body;

    const createObj = {
      sort_order_no,
      committeeName,
      isActive,
    };
    const docFile = req.files.find((file) => file.fieldname === "committeeDoc");
    const committeeDoc = docFile
      ? "boardAndCommittees/" + docFile.filename
      : "";
    if (committeeDoc) {
      createObj.committeeDoc = committeeDoc;
    }

    const saveData = await boardAndCommitteesSchema(createObj);
    await saveData
      .save()
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Committee Added Successfully.",
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

exports.updateCommittee = async (req, res) => {
  try {
    const { committee_id, sort_order_no, committeeName, isActive } = req.body;

    const findData = await boardAndCommitteesSchema.findById(committee_id);
    if (!findData) {
      return res.status(200).send({
        message: "Committee with this id not found!",
        isSuccess: false,
      });
    }

    const updateObj = {
      sort_order_no,
      committeeName,
      isActive,
    };

    const docFile = req.files.find((file) => file.fieldname === "committeeDoc");
    const committeeDoc = docFile
      ? "boardAndCommittees/" + docFile.filename
      : "";

    if (committeeDoc) {
      if (findData.committeeDoc) {
        await deleteImage(findData.committeeDoc);
      }
      updateObj.committeeDoc = committeeDoc;
    }

    await boardAndCommitteesSchema
      .findByIdAndUpdate(committee_id, updateObj, { new: true })
      .then(async () => {
        return res.status(200).send({
          isSuccess: true,
          message: "Committee updated successfully.",
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

exports.deleteCommittee = async (req, res) => {
  try {
    const committee_id = req.body.committee_id;
    await boardAndCommitteesSchema
      .findByIdAndDelete(committee_id)
      .then(async (data) => {
        if (data && data.committeeDoc) {
          await deleteImage(data.committeeDoc);
        }
        if (!data) {
          return res.status(404).send({
            message: "Committee with this id not found!",
            isSuccess: false,
          });
        }
        return res.status(200).send({
          isSuccess: true,
          message: "Committee deleted successfully.",
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

exports.getAllCommittees = async (req, res) => {
  try {
    const getData = await boardAndCommitteesSchema
      .find({ isActive: true })
      .sort({
        sort_order_no: 1,
      });
    return res.status(200).send({
      isSuccess: true,
      message: "Committees listed successfully.",
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
    const committee_id = req.body.committee_id;
    const getData = await boardAndCommitteesSchema.findById(committee_id);
    return res.status(200).send({
      isSuccess: true,
      message: "Committee fetched successfully.",
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
    const getData = await boardAndCommitteesSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await boardAndCommitteesSchema.countDocuments();
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Committees listed successfully.",
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
    const lastSortOrderItem = await boardAndCommitteesSchema
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
