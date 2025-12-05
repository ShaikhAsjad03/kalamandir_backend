const express = require("express");
const router = express.Router();

const { validateCreate, validateUpdate } = require("../validations/certificate.validation");

const {
  createCertificate,
  updateCertificate,
  deleteCertificate,
  getPaginationData,
  getDataById,
  getAllCertificates,
  getLastSrNo,
} = require("../controllers/certificate.controller");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");
const { uploadCertificate } = require("../middlewares/upload");

router.post("/createCertificate", verifyTokenAdmin, uploadCertificate, validateCreate, createCertificate);
router.post("/updateCertificate", verifyTokenAdmin, uploadCertificate, validateUpdate, updateCertificate);
router.post("/deleteCertificate", verifyTokenAdmin, deleteCertificate);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);

router.post("/getAllCertificates", getAllCertificates);

module.exports = router;
