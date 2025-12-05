const express = require("express");
const router = express.Router();
const {
  validateCreate,
  validateUpdate,
} = require("../validations/gender.validation");
const {
  createApi,
  updateApi,
  deleteApi,
  getPaginationData,
  getDataById,
  getAllApis,
  getLastSrNo,
} = require("../controllers/gender.controller");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");

router.post("/createApi", verifyTokenAdmin, validateCreate, createApi);
router.post("/updateApi", verifyTokenAdmin, validateUpdate, updateApi);
router.post("/deleteApi", verifyTokenAdmin, deleteApi);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);

router.post("/getAllApis", getAllApis);

module.exports = router;
