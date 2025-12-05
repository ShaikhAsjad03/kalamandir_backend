const testimonialSchema = require("../models/testimonials.model");

exports.createApi = async (req, res) => {
  try {
    const { sort_order_no, name, message, title, isActive } = req.body;
    const createObj = {
      sort_order_no,
      name,
      title,
      message,
      isActive
    };
    const saveData = await testimonialSchema(createObj);
    await saveData
      .save()
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Testimonial Added successfully.",
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
    const { testimonial_id, sort_order_no, name, message, title, isActive } = req.body;

    const findData = await testimonialSchema.findById(testimonial_id);
    if (!findData) {
      return res.status(200).send({
        message: "Testimonial with this id not found!",
        isSuccess: false,
      });
    }
    const updateObj = {
      sort_order_no,
      name,
      message,
      title,
      isActive,
    };

    await testimonialSchema
      .findByIdAndUpdate(testimonial_id, updateObj, { new: true })
      .then(async (data) => {
        return res.status(200).send({
          isSuccess: true,
          message: "Testimonial updated successfully.",
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
    const testimonial_id = req.body.testimonial_id;
    await testimonialSchema
      .findByIdAndDelete(testimonial_id)
      .then(async (data) => {
        if (!data) {
          return res
            .status(404)
            .send({ message: "Testimonial with this id not found!", isSuccess: false });
        }
        return res.status(200).send({
          isSuccess: true,
          message: "Testimonial deleted successfully.",
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
    const getData = await testimonialSchema
    .find({ isActive: true })
    .sort({ sort_order_no: 1 });
    return res.status(200).send({
      isSuccess: true,
      message: "Testimonials listed successfully.",
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
    const testimonial_id = req.body.testimonial_id;
    const getData = await testimonialSchema.findById(testimonial_id);
    return res.status(200).send({
      isSuccess: true,
      message: "Get Testimonial successfully.",
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
    const getData = await testimonialSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await testimonialSchema.countDocuments();
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Testimonials listed successfully.",
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
    const lastSortOrderItem = await testimonialSchema
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
