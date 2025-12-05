const express = require("express");
const router = express.Router();
const {
  validateCreate,
  validateUpdate,
} = require("../validations/brand.validation");
const {
  createApi,
  updateApi,
  deleteApi,
  getPaginationData,
  getDataById,
  getAllApis,
  getLastSrNo,
  getAllBrands,
  getbrandswithProduct,
  getBrandsWithProducts,
  getAllSubBrands,
} = require("../controllers/brand.controller");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");
const { uploadMainBrandBanner } = require("../middlewares/upload");

router.post(
  "/createApi",
  verifyTokenAdmin,
  validateCreate,
  uploadMainBrandBanner,
  createApi
);
router.post(
  "/updateApi",
  verifyTokenAdmin,
  validateUpdate,
  uploadMainBrandBanner,
  updateApi
);
router.post("/deleteApi", verifyTokenAdmin, deleteApi);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.get("/getAllBrands", getAllBrands);
router.get("/ProductAll/:slug", getBrandsWithProducts);
router.get("/getAllSubBrands/:slug", getAllSubBrands);

module.exports = router;
