const express = require("express");
const router = express.Router();
const {
  validateCreate,
  validateUpdate,
} = require("../validations/disclousers.validation");
const {
  createDisclouser,
  updateDisclouser,
  deleteDisclouser,
  getPaginationData,
  getDataById,
  getAllDisclousers,
  getLastSrNo,
} = require("../controllers/disclousers.controller");

const { verifyTokenAdmin } = require("../middlewares/admin.auth");
const { uploadDisclousers } = require("../middlewares/upload");

router.post(
  "/createDisclouser",
  verifyTokenAdmin,
  uploadDisclousers,
  validateCreate,
  createDisclouser
);
router.post(
  "/updateDisclouser",
  verifyTokenAdmin,
  uploadDisclousers,
  validateUpdate,
  updateDisclouser
);
router.post("/deleteDisclouser", verifyTokenAdmin, deleteDisclouser);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);

router.post("/getAllDisclousers", getAllDisclousers);

module.exports = router;
