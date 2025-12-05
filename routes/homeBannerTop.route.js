const express = require("express");
const router = express.Router();
const {bannerTopValidate} = require("../validations/homeBannerTop.validation");
const {
  createApi,
  updateApi,
  deleteApi,
  getPaginationData,
  getDataById,
  getAllApis,
  getLastSrNo,
} = require("../controllers/homeBannerTop.controller");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");
const { uploadBanner } = require("../middlewares/upload");

router.post(
  "/createApi",
  verifyTokenAdmin,
  uploadBanner,
  bannerTopValidate,
  createApi
);
router.post(
  "/updateApi",
  verifyTokenAdmin,
  uploadBanner,
  bannerTopValidate,
  updateApi
);
router.post("/deleteApi", verifyTokenAdmin, deleteApi);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.get("/getAllApis", getAllApis);

module.exports = router;
