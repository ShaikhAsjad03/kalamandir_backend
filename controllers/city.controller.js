const citySchema = require("../models/city.model");
const { deleteImage } = require("../helpers/common");

exports.createApi = async (req, res) => {
  try {
    let { sort_order_no, city, state, url, isActive } = req.body;

    const createObj = {
      sort_order_no,
      city,
      state,
      url,
      isActive,
    };

    const cityImageFile = req.file;
    if (cityImageFile) {
      createObj.image = "city/" + cityImageFile.filename;
    }

    const saveData = await citySchema(createObj);
    await saveData
      .save()
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "City Added successfully.",
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
    const {id}=req.params
    let {sort_order_no, city, state, url, isActive } = req.body;
    const findData = await citySchema.findById(id);
    if (!findData) {
      return res.status(200).send({
        message: "City with this id not found!",
        isSuccess: false,
      });
    }
    const updateObj = {
      sort_order_no,
      city,
      state,
      url,
      isActive,
    };
    
    if (req.file) {
      if (findData.image) await deleteImage(findData.image);
      updateObj.image = "city/" + req.file.filename;
      
    }

    await citySchema
      .findByIdAndUpdate(id, updateObj, { new: true })
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "City updated successfully.",
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
    const {id} = req.params;
    let existCity = await citySchema.findById({ _id: id });

    if (!existCity) {
      return res.status(404).send({
        message: "City with this id not found!",
        isSuccess: false,
      });
    }

    await citySchema
      .findByIdAndDelete(id)
      .then(async (data) => {
        if (data.image) {
          await deleteImage(data.image);
        }

        return res.status(200).send({
          isSuccess: true,
          message: "City deleted successfully.",
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
    let query = { isActive: true };
    const getData = await citySchema
      .find(query)
      .sort({ sort_order_no: 1 })
      .lean();

    if (!getData || getData.length === 0) {
      return res.status(404).send({
        isSuccess: false,
        message: "No City found for this page.",
        data: [],
      });
    }

    return res.status(200).send({
      isSuccess: true,
      message: "Cities listed successfully.",
      total: getData.length,
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      isSuccess: false,
      message: error.message,
    });
  }
};
exports.getDataById = async (req, res) => {
  try {
    const city_id = req.body.city_id;
    const getData = await citySchema.findById(city_id);
    if (!getData) {
      return res.status(404).send({
        isSuccess: false,
        message: "City with this id not found!",
      });
    }
    return res.status(200).send({
      isSuccess: true,
      message: "City listed successfully.",
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
    const totalRecords = await citySchema.countDocuments();
    const getData = await citySchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    if (!getData || getData.length === 0) {
      return res.status(200).send({
        isSuccess: false,
        message: "No cities found.",
        data: [],
      });
    }

    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Cities listed successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(200).send({
      isSuccess: false,
      message: error.message,
      data: [],
    });
  }
};
exports.getLastSrNo = async (req, res) => {
  try {
    const lastSortOrderItem = await citySchema
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
