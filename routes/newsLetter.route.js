const express = require("express");
const router = express.Router();
const { validateCreate } = require("../validations/newsLetter.validation");

const {
  createApi,
  getAllApis,
  deleteApi,
  getDataById,
  getPaginationData,
} = require("../controllers/newsLetter.controller");

const { verifyTokenAdmin } = require("../middlewares/admin.auth");

router.post("/createApi", validateCreate, createApi);
router.post("/deleteApi", verifyTokenAdmin, deleteApi);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);

router.post("/getAllApis", getAllApis);

module.exports = router;
