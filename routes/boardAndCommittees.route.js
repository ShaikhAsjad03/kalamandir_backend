const express = require("express");
const router = express.Router();
const {
  validateCreate,
  validateUpdate,
} = require("../validations/boardAndCommittees.validation");
const {
  createCommittee,
  updateCommittee,
  deleteCommittee,
  getPaginationData,
  getDataById,
  getAllCommittees,
  getLastSrNo,
} = require("../controllers/boardAndCommitiees.controller");

const { verifyTokenAdmin } = require("../middlewares/admin.auth");
const { uploadBoardAndCommittees } = require("../middlewares/upload");

router.post(
  "/createCommittee",
  verifyTokenAdmin,
  uploadBoardAndCommittees,
  validateCreate,
  createCommittee
);
router.post(
  "/updateCommittee",
  verifyTokenAdmin,
  uploadBoardAndCommittees,
  validateUpdate,
  updateCommittee
);
router.post("/deleteCommittee", verifyTokenAdmin, deleteCommittee);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);

router.post("/getAllCommittees", getAllCommittees);

module.exports = router;
