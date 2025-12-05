const express = require("express");
const router = express.Router();

const {
 validateCreate,
 validateUpdate,
} = require("../validations/banner.validation");

const {
  createBanner,
  updateBanner,
  deleteBanner,
  getPaginationData,
  getDataById,
  getAllBanners,
  getLastSrNo,
} = require("../controllers/banner.controller");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");
const { uploadBanner } = require("../middlewares/upload");

router.post(
  "/createBanner",
  verifyTokenAdmin,
  uploadBanner,
  validateCreate,
  createBanner
);
router.post(
  "/updateBanner",
  verifyTokenAdmin,
  uploadBanner,
  validateUpdate,
  updateBanner
);
router.post("/deleteBanner", verifyTokenAdmin, deleteBanner);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.get("/getAllBanners/:slug", getAllBanners);

module.exports = router;
