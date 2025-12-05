const userTypeSchema = require("../models/userType.model");
exports.createUserType = async (req, res) => {
  try {
    const { name } = req.body;
    const findType = await userTypeSchema.findOne({name: name});
    if (findType) {
      return res
        .status(409)
        .send({ message: "Type is already existing!", isSuccess: false });
    } else {
      const type = await userTypeSchema({name});
      type.save();
      return res.status(200).send({
        isSuccess: true,
        message: "Page created successfully.",
        data: type,
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
exports.updateUserType = async (req, res) => {
  try {
    const typeId = req.params.typeId;
    const { name } = req.body;
   

    const getType = await userTypeSchema.findOne({
      _id: { $ne: typeId },
      name: name,
    });
    if (getType) {
      return res.status(409).send({
        message: "Type is already existing!",
        isSuccess: false,
      });
    }
    await userTypeSchema
      .findByIdAndUpdate(typeId, { name }, { new: true })
      .then((page) => {
        if (!page) {
          return res.status(404).send({
            message: "Type not found!",
            isSuccess: false,
          });
        }
        return res.status(200).send({
          message: "Type updated successfully.",
          isSuccess: true,
          data: page,
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
exports.listAllUserType = async (req, res) => {
  try {
    let { search, pageNo, perPage } = req.body;
    pageNo = pageNo ? pageNo : 1;
    perPage = perPage ? perPage : 10;
    const filter = {};
    if (search && search.trim() !== "") {
      filter.pageName = { $regex: `${search}`, $options: "i" };
    }
    await userTypeSchema
      .find(filter)
      .sort({ updatedAt: -1 })
      .skip(perPage * pageNo - perPage)
      .limit(perPage)
      .then(async (data) => {
        const totalRecords = await userTypeSchema.countDocuments();
        return res.status(200).send({
          data,
          currentPageNo: pageNo,
          totalRecords: totalRecords,
          totalPages: Math.ceil(totalRecords / perPage),
          isSuccess: true,
          message: "Type listing successfully.",
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
exports.deleteUserType = async (req, res) => {
  try {
    const typeId = req.params.typeId;
    await userTypeSchema
      .findByIdAndDelete(typeId)
      .then((type) => {
        if (!type)
          return res
            .status(404)
            .send({ message: "Type not found!", isSuccess: false });
        return res
          .status(200)
          .send({ message: "Type deleted successfully.", isSuccess: true });
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

exports.listAllUserTypeWithoutPagination = async (req, res) => {
  try {
    const data = await userTypeSchema.find();
    return res.status(200).send({
      data,
      isSuccess: true,
      message: "Type listing successfully.",
    });

  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
