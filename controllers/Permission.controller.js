const Permission = require("../models/Permission.model");
const userTypeSchema = require("../models/userType.model");
const pageSchema = require("../models/page.model");
const adminSchema = require("../models/admin.model")
const mongoose = require("mongoose");
exports.createPermission = async (req, res) => {
  try {
    const { roleId, pageId, actionType } = req.body;

   const existingPermission = await Permission.findOne({ roleId, pageId });
    if (existingPermission) {
      return res.status(400).json({
        isSuccess: false,
        message: "Permission already exists for this role and page",
      });
    }
     const newPermission = new Permission({
      roleId,
      pageId,
      actionType,
    });

    await newPermission.save();

    return res.status(200).json({
      isSuccess: true,
      message: "Permission updated successfully",
      data: newPermission,
    });
  } catch (error) {
    return res.status(500).json({ isSuccess: false, message: error.message });
  }
};

exports.getAllPermissions = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const admin = await adminSchema.findById(adminId).select("userType");
    if (!admin) {
      return res.status(404).json({
        isSuccess: false,
        message: "Admin not found",
      });
    }

    const roleId = admin.userType;
    const records = await Permission.find({
      roleId: new mongoose.Types.ObjectId(roleId),
      isActive: true,
    }).populate("pageId"); 

    if (!records || records.length === 0) {
      return res.status(200).json({
        isSuccess: true,
        message: "No permissions assigned",
        data: [],
      });
    }
    const formatted = records.map((p) => ({
      page: p.pageId?.key || p.pageId?.pageName || "",
      pageId: p.pageId?._id,
      actions: p.actionType || [],
    }));

    return res.status(200).json({
      isSuccess: true,
      message: "Role permissions fetched successfully",
      data: formatted,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.getPermissionById = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Permission.findById(id)
      .populate("roleId")
      .populate("permissions.pageId");

    if (!data) {
      return res.status(404).json({
        isSuccess: false,
        message: "Role permission not found",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      message: "Role permission fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
exports.updatePermission = async (req, res) => {
  try {
    const id = req.params.id;
    const { pageId, actionType, isActive } = req.body;
    const updateData = {};
    if (pageId) updateData.pageId = pageId;
    if (actionType && actionType.length) updateData.actionType = actionType;
    const updatedPermission = await Permission.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedPermission) {
      return res.status(404).json({
        isSuccess: false,
        message: "Permission not found",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      message: "Permission updated successfully",
      data: updatedPermission,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.deletePermission = async (req, res) => {
  try {
    const id = req.params.id;

    const role = await Permission.findByIdAndDelete(id);

    if (!role) {
      return res.status(404).json({
        isSuccess: false,
        message: "Permission not found",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      message: "Permission deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.getPaginationData = async (req, res) => {
  try {
    let { search, pageNo, perPage, roleId } = req.body;

    pageNo = Number(pageNo) || 1;
    perPage = Number(perPage) || 10;

    const filter = {};
    if (roleId) filter.roleId = roleId;

    if (search && search.trim() !== "") {
      filter.$or = [
        { actionType: { $regex: search, $options: "i" } },
        { "roleId.name": { $regex: search, $options: "i" } },
      ];
    }

    const skipCount = (pageNo - 1) * perPage;

    const rawData = await Permission.find(filter)
      .populate("roleId", "name")
      .populate("pageId", "pageName")
      .sort({ updatedAt: -1 })
      .skip(skipCount)
      .limit(perPage);

    // Format response
    const formattedData = rawData.map((item) => ({
      _id: item._id,
      roleId: item.roleId?._id || null,
      roleName: item.roleId?.name || "",
      pageId: item.pageId?._id || null,
      pageName: item.pageId?.pageName || "",
      actionType: item.actionType || [],
      isActive: item.isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    return res.status(200).json({
      data: formattedData,
      currentPageNo: pageNo,
      totalRecords: formattedData.length,
      totalPages: Math.ceil(formattedData.length / perPage),
      isSuccess: true,
      message: "Permissions fetched successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      isSuccess: false,
    });
  }
};


