const express = require("express");
const router = express.Router();
const {
  validateCreate,
  validateUpdate,
} = require("../validations/pageWiseFAQ.validation");
const {
  createApi,
  updateApi,
  deleteApi,
  getPaginationData,
  getDataById,
  getAllApis,
  getLastSrNo,
  getDataBySlug
} = require("../controllers/pageWiseFAQ.controller");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");
router.post("/createApi", verifyTokenAdmin, validateCreate, createApi);
router.post("/updateApi", verifyTokenAdmin, validateUpdate, updateApi);
router.post("/deleteApi", verifyTokenAdmin, deleteApi);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.get("/getDataBySlug/:slug", getDataBySlug);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);

router.post("/getAllApis", getAllApis);

module.exports = router;