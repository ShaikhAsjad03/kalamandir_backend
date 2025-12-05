const express = require("express");
const router = express.Router();

const {
  validateCreate,
  validateUpdate,
} = require("../validations/schemes.validation");

const {
  createScheme,
  updateScheme,
  deleteScheme,
  getPaginationData,
  getDataById,
  getAllSchemes,
  getLastSrNo,
} = require("../controllers/schemes.controller");

const { verifyTokenAdmin } = require("../middlewares/admin.auth");

router.post("/createScheme", verifyTokenAdmin, validateCreate, createScheme);
router.post("/updateScheme", verifyTokenAdmin, validateUpdate, updateScheme);
router.post("/deleteScheme", verifyTokenAdmin, deleteScheme);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);

router.post("/getAllSchemes", getAllSchemes);

module.exports = router;
