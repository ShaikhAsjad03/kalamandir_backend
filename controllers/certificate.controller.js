const certificateSchema = require("../models/certificate.model");
const { deleteImage } = require("../helpers/common");

exports.createCertificate = async (req, res) => {
  try {
    const { sort_order_no, name, link, isActive } = req.body;

    const createObj = {
      sort_order_no,
      name,
      link,
      isActive,
    };
    const imageFile = req.files.find(
      (file) => file.fieldname === "certificateImage"
    );
    const certificateImage = imageFile
      ? "certificate/" + imageFile.filename
      : "";
    if (certificateImage) {
      createObj.certificateImage = certificateImage;
    }
    const saveData = new certificateSchema(createObj);
    await saveData.save();

    return res.status(200).send({
      isSuccess: true,
      message: "Certificate Added successfully.",
      data: saveData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.updateCertificate = async (req, res) => {
  try {
    const { certificate_id, sort_order_no, name, link, isActive } = req.body;

    const findData = await certificateSchema.findById(certificate_id);
    if (!findData) {
      return res.status(404).send({
        message: "Certificate with this id not found!",
        isSuccess: false,
      });
    }

    const updateObj = { sort_order_no, name, link, isActive };

    // Handle new image upload
    const imageFile = req.files.find((file) => file.fieldname === "certificateImage");
    const certificateImage = imageFile ? "certificate/" + imageFile.filename : "";

    if (certificateImage) {
      if (findData.certificateImage) {
        await deleteImage(findData.certificateImage);
      }
      updateObj.certificateImage = certificateImage;
    }

    await certificateSchema.findByIdAndUpdate(certificate_id, updateObj, {
      new: true,
    });

    return res.status(200).send({
      isSuccess: true,
      message: "Certificate updated successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.deleteCertificate = async (req, res) => {
  try {
    const certificate_id = req.body.certificate_id;
    const data = await certificateSchema.findByIdAndDelete(certificate_id);

    if (!data) {
      return res.status(404).send({
        message: "Certificate with this id not found!",
        isSuccess: false,
      });
    }

    if (data.certificateImage) {
      deleteImage(data.certificateImage);
    }

    return res.status(200).send({
      isSuccess: true,
      message: "Certificate deleted successfully.",
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
    const getData = await certificateSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await certificateSchema.countDocuments();
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Certificates listed successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.getAllCertificates = async (req, res) => {
  try {
    const getData = await certificateSchema
      .find({ isActive: true })
      .sort({ sort_order_no: 1 });
    return res.status(200).send({
      isSuccess: true,
      message: "Certificates listed successfully.",
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
    const certificate_id = req.body.certificate_id;
    const getData = await certificateSchema.findById(certificate_id);
    return res.status(200).send({
      isSuccess: true,
      message: "Get Certificate successfully.",
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
    const lastSortOrderItem = await certificateSchema
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
