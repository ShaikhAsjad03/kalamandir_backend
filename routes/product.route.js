const express = require("express");
const router = express.Router();
const {
  validateCreate,
  validateUpdate,
} = require("../validations/product.validation");
const {
  createApi,
  updateApi,
  deleteApi,
  getPaginationData,
  getDataById,
  getAllApis,
  getCategoryByCollection,
  getProductsBySlug,
  getProductDetailByCode,
  getCollectionBySlug,
} = require("../controllers/product.controller");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");
const { uploadProducts } = require("../middlewares/upload");
// const { uploadExcel } = require("../middlewares/upload");

router.post(
  "/createApi",
  verifyTokenAdmin,
  validateCreate,
  uploadProducts,
  createApi
);
router.post(
  "/updateApi",
  verifyTokenAdmin,
  validateUpdate,
  uploadProducts,
  updateApi
);
router.post("/deleteApi", verifyTokenAdmin, deleteApi);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getCategoryByCollection", getCategoryByCollection);
router.post("/getCollectionBySlug/:slug", getCollectionBySlug);

router.post("/getAllApis", getAllApis);
// router.post("/uploadCSV", uploadExcel, uploadCSV);

router.post("/getProductsBySlug", getProductsBySlug);
router.get("/getProductDetailByCode/:productCode", getProductDetailByCode);

module.exports = router;
