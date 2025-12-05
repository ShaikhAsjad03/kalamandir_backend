const express = require("express");
const router = express.Router();
const {
  validateCreate,
  validateUpdate,
} = require("../validations/homeCMSContent.validation");
const {
  createApi,
  updateApi,
  deleteApi,
  getPaginationData,
  getDataById,
  getAllApis,
  getLastSrNo,
  getDataBySlug
} = require("../controllers/homeCMSContent.controller");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");
const { uploadPageContentImage } = require("../middlewares/upload");

router.post("/createApi", verifyTokenAdmin, validateCreate, uploadPageContentImage, createApi);
router.post("/updateApi", verifyTokenAdmin, validateUpdate, uploadPageContentImage, updateApi);
router.post("/deleteApi", verifyTokenAdmin, deleteApi);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getDataBySlug/:slug", getDataBySlug);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.get("/getAllApis/:page_name", getAllApis);

module.exports = router;