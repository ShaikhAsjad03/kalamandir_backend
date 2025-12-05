const videoSchema = require("../models/videos.model");
const { deleteImage } = require("../helpers/common");

exports.createVideo = async (req, res) => {
  try {
    const { sort_order_no, title, video_url, isActive = true } = req.body;

    if (!video_url || !title) {
      return res.status(400).send({
        isSuccess: false,
        message: "Title and Video URL are required",
      });
    }

    const saveData = new videoSchema({
      sort_order_no,
      title,
      video_url, // Save the YouTube URL directly
      isActive,
    });

    await saveData.save();

    return res.status(200).send({
      isSuccess: true,
      message: "Video added successfully",
      data: saveData,
    });
  } catch (error) {
    return res.status(500).send({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const { video_id, sort_order_no, title, video_url, isActive } = req.body;

    const findData = await videoSchema.findById(video_id);
    if (!findData) {
      return res.status(404).send({
        isSuccess: false,
        message: "Video not found",
      });
    }

    const updateObj = { sort_order_no, title, video_url, isActive };

    await videoSchema.findByIdAndUpdate(video_id, updateObj, { new: true });

    return res.status(200).send({
      isSuccess: true,
      message: "Video updated successfully",
    });
  } catch (error) {
    return res.status(500).send({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const video_id = req.body.video_id;
    await videoSchema
      .findByIdAndDelete(video_id)
      .then(async (data) => {
      
        if (!data) {
          return res
            .status(404)
            .send({
              message: "Video with this id not found!",
              isSuccess: false,
            });
        }
        return res.status(200).send({
          isSuccess: true,
          message: "Video deleted successfully.",
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
    const getData = await videoSchema
      .find()
      .sort({ sort_order_no: 1 })
      .skip(skip)
      .limit(limit);
    const totalRecords = await videoSchema.countDocuments();
    return res.status(200).send({
      isSuccess: true,
      currentPageNo: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      message: "Videos listed successfully.",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};

exports.getAllVideos = async (req, res) => {
  try {
    const getData = await videoSchema
      .find({ isActive: true })
      .sort({ sort_order_no: 1 });
    return res.status(200).send({
      isSuccess: true,
      message: "Videos listed successfully.",
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
    const video_id = req.body.video_id;
    const getData = await videoSchema.findById(video_id);
    return res.status(200).send({
      isSuccess: true,
      message: "Get Video successfully.",
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
    const lastSortOrderItem = await videoSchema
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
