const pageSchema = require("../models/page.model");

exports.createPage = async (req, res) => {
  try {
    const { pageName, action } = req.body;
    const escapedName = pageName.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const nameRegex = new RegExp("^" + escapedName + "$", "i");
    const findPage = await pageSchema.findOne({
      pageName: nameRegex,
    });
    if (findPage) {
      return res
        .status(409)
        .send({ message: "Page is already existing!", isSuccess: false });
    } else {
      const newPage = await pageSchema({
        pageName,
        action,
      });
      newPage.save();
      return res.status(200).send({
        isSuccess: true,
        message: "Page created successfully.",
        data: newPage,
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
exports.updatePage = async (req, res) => {
  try {
    const pageId = req.params.pageId;
    const { pageName, action } = req.body;
    const getPage = await pageSchema.findById(pageId);
    if (!getPage) {
      return res.status(404).send({
        message: "Invalid page id!",
        isSuccess: false,
      });
    }
    const escapedName = pageName.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const nameRegex = new RegExp("^" + escapedName + "$", "i");
    const updatePage = await pageSchema.findOne({
      _id: { $ne: pageId },
      pageName: nameRegex,
    });
    if (updatePage) {
      return res.status(409).send({
        message: "Page is already existing!",
        isSuccess: false,
      });
    }
    await pageSchema
      .findByIdAndUpdate(
        pageId,
        { pageName, ...(action && { action }) },
        { new: true }
      )
      .then((page) => {
        if (!page) {
          return res.status(404).send({
            message: "Page not found!",
            isSuccess: false,
          });
        }
        return res.status(200).send({
          message: "Page updated successfully.",
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
exports.listAllPage = async (req, res) => {
  try {
    let { search, pageNo, perPage } = req.body;
    pageNo = pageNo ? pageNo : 1;
    perPage = perPage ? perPage : 10;
    const filter = {};
    if (search && search.trim() !== "") {
      filter.pageName = { $regex: `${search}`, $options: "i" };
    }
    await pageSchema
      .find(filter)
      .sort({ updatedAt: -1 })
      .skip(perPage * pageNo - perPage)
      .limit(perPage)
      .then(async (data) => {
        const totalRecords = await pageSchema.countDocuments();
        return res.status(200).send({
          data,
          currentPageNo: pageNo,
          totalRecords: totalRecords,
          totalPages: Math.ceil(totalRecords / perPage),
          isSuccess: true,
          message: "Page listing successfully.",
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
exports.deletePage = async (req, res) => {
  try {
    const pageId = req.params.pageId;
    await pageSchema
      .findByIdAndDelete(pageId)
      .then((page) => {
        if (!page)
          return res
            .status(404)
            .send({ message: "Page not found!", isSuccess: false });
        return res
          .status(200)
          .send({ message: "Page deleted successfully.", isSuccess: true });
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
exports.listAllPageWithoutPagination = async (req, res) => {
  try {
    const data = await pageSchema.find({ isActive: true }).sort({ _id: -1 });

    return res.status(200).send({
      data,
      isSuccess: true,
      message: "Page listing successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      isSuccess: false,
    });
  }
};
