const express = require("express");
const router = express.Router();
const {
  validateCreate,
  validateUpdate,
} = require("../validations/policies.validation");
const {
  createPolicy,
  updatePolicy,
  deletePolicy,
  getPaginationData,
  getDataById,
  getAllPolicies,
  getLastSrNo,
} = require("../controllers/policies.controller");

const { verifyTokenAdmin } = require("../middlewares/admin.auth");
const { uploadPolicies } = require("../middlewares/upload");

router.post(
  "/createPolicy",
  verifyTokenAdmin,
  uploadPolicies,
  validateCreate,
  createPolicy
);
router.post(
  "/updatePolicy",
  verifyTokenAdmin,
  uploadPolicies,
  validateUpdate,
  updatePolicy
);
router.post("/deletePolicy", verifyTokenAdmin, deletePolicy);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);

router.post("/getAllPolicies", getAllPolicies);

module.exports = router;
