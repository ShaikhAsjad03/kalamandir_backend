const express = require("express");
const router = express.Router();
const {
  validateCreate,
  validateUpdate,
} = require("../validations/goldrate.validation");
const {
  createApi,
  updateApi,
  getDataById,
  getAllApis
} = require("../controllers/goldRate.controller");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");

router.post("/createApi", verifyTokenAdmin, validateCreate, createApi);
router.post("/updateApi", verifyTokenAdmin, validateUpdate, updateApi);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getAllApis", getAllApis);

module.exports = router;
