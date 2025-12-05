const storeLocatorSchema = require("../models/storeLocator.model");
const { deleteImage } = require("../helpers/common");

exports.createStoreLocator = async (req, res) => {
  try {
    const { sort_order_no, address, mapIframe, isActive } = req.body;
    const createObj = {
      sort_order_no,
      address,
      mapIframe,
      isActive,
    };
    const imageFile = req.files.find((file) => file.fieldname === "storeImage");
    const storeImage = imageFile ? "storeLocator/" + imageFile.filename : "";
    if (storeImage) {
      createObj.storeImage = storeImage;
    }
    const saveData = await storeLocatorSchema(createObj);
    await saveData
      .save()
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Store Location Added successfully.",
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

exports.updateStoreLocator = async (req, res) => {
  try {
    const { store_id, sort_order_no, address, mapIframe, isActive } = req.body;

    const findData = await storeLocatorSchema.findById(store_id);
    if (!findData) {
      return res.status(200).send({
        message: "Store Location with this id not found!",
        isSuccess: false,
      });
    }
    const updateObj = {
      sort_order_no,
      address,
      mapIframe,
      isActive,
    };
    const imageFile = req.files.find((file) => file.fieldname === "storeImage");
    const storeImage = imageFile ? "storeLocator/" + imageFile.filename : "";
    if (storeImage) {
      updateObj.storeImage = storeImage;
    }
    if (storeImage) {
      if (findData.storeImage) {
        await deleteImage(findData.storeImage);
      }
      updateObj.storeImage = storeImage;
    }
    await storeLocatorSchema
      .findByIdAndUpdate(store_id, updateObj, { new: true })
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Store Location updated successfully.",
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

exports.deleteStoreLocator = async (req, res) => {
  try {
    const store_id = req.body.store_id;
    await storeLocatorSchema
      .findByIdAndDelete(store_id)
      .then(async (data) => {
        if (data.storeImage) {
          await deleteImage(data.storeImage);
        }
        if (!data) {
          return res.status(404).send({
            message: "Store Location with this id not found!",
            isSuccess: false,
          });
        }
        return res.status(200).send({
          isSuccess: true,
          message: "Store Location deleted successfully.",
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

exports.getPaginationData = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    const skip = (page - 1) * limit;
    const getData = await storeLocatorSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await storeLocatorSchema.countDocuments();
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Store Locations listed successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.getAllStoreLocator = async (req, res) => {
  try {
    const getData = await storeLocatorSchema
      .find({ isActive: true })
      .sort({ sort_order_no: 1 });
    return res.status(200).send({
      isSuccess: true,
      message: "Store Locations listed successfully.",
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
    const store_id = req.body.store_id;
    const getData = await storeLocatorSchema.findById(store_id);
    return res.status(200).send({
      isSuccess: true,
      message: "Get Store Location successfully.",
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
    const lastSortOrderItem = await storeLocatorSchema
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
