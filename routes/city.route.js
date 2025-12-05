const express = require("express");
const router = express.Router();
const {
  validateCreate,
  validateUpdate,
} = require("../validations/city.validation");
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
} = require("../controllers/city.controller");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");
const { uploadCity } = require("../middlewares/upload");

router.post(
  "/createApi",
  verifyTokenAdmin,
  validateCreate,
  uploadCity,
  createApi
);
router.put(
  "/updateApi/:id",
  verifyTokenAdmin,
  validateUpdate,
  uploadCity,
  updateApi
);
router.delete("/deleteApi/:id", verifyTokenAdmin, deleteApi);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllApis", getAllApis);

module.exports = router;
