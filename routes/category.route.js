const express = require("express");
const router = express.Router();
const {
  validateCreate,
  validateUpdate,
} = require("../validations/category.validation");
const {
  createApi,
  updateApi,
  deleteApi,
  getPaginationData,
  getDataById,
  getAllApis,
  getLastSrNo,
  getAllCategory,
  getCategoryWithProducts,
  getAllSubCategory,
} = require("../controllers/category.controller");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");
const { uploadCategory } = require("../middlewares/upload");

router.post(
  "/createApi",
  verifyTokenAdmin,
  validateCreate,
  uploadCategory,
  createApi
);
router.post(
  "/updateApi",
  verifyTokenAdmin,
  validateUpdate,
  uploadCategory,
  updateApi
);
router.post("/deleteApi", verifyTokenAdmin, deleteApi);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.get("/getAllCategory", getAllCategory);
router.get("/getAllSubCategory/:slug", getAllSubCategory);
router.post("/getAllApis", getAllApis);
router.get("/ProductAll/:slug", getCategoryWithProducts);

module.exports = router;
