const express = require("express");
const router = express.Router();
const {
  validateCreate,
  validateUpdate,
} = require("../validations/homeBanner.validation");
const {
  createApi,
  updateApi,
  deleteApi,
  getPaginationData,
  getDataById,
  getAllApis,
  getLastSrNo,
} = require("../controllers/homeBanner.controller");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");
const { uploadHomeBanner } = require("../middlewares/upload");

router.post(
  "/createApi",
  verifyTokenAdmin,
  uploadHomeBanner,
  validateCreate,
  createApi
);
router.post(
  "/updateApi",
  verifyTokenAdmin,
  uploadHomeBanner,
  validateUpdate,
  updateApi
);
router.post("/deleteApi", verifyTokenAdmin, deleteApi);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getAllApis", getAllApis);

module.exports = router;
