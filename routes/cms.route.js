const express = require("express");
const router = express.Router();
const {
  validateCreate,
  validateUpdate,
} = require("../validations/cms.validation");
const {
  createCms,
  updateCms,
  deleteCms,
  getPaginationData,
  getDataById,
  getCmsBySlug,
  getAllCms,
  getLastSrNo,
  getCMSById
} = require("../controllers/cms.controller");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");
const { uploadCMSImage } = require("../middlewares/upload");

router.post(
  "/createCms",
  verifyTokenAdmin,
  uploadCMSImage,
  validateCreate,
  createCms
);
router.post(
  "/updateCms",
  verifyTokenAdmin,
  uploadCMSImage,
  validateUpdate,
  updateCms
);
router.post("/deleteCms", verifyTokenAdmin, deleteCms);
router.get("/getCmsBySlug/:slug", getCmsBySlug);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);

router.get("/getAllCms", getAllCms);
router.post("/getCMSById", getCMSById);

module.exports = router;
