const express = require("express");
const router = express.Router();
const {
  validateCreate,
  validateUpdate,
} = require("../validations/collection.validation");
const {
  createApi,
  updateApi,
  deleteApi,
  getPaginationData,
  getDataById,
  getAllApis,
  getLastSrNoByCategory,

} = require("../controllers/collection.controller");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");

router.post("/createApi", verifyTokenAdmin, validateCreate, createApi);
router.post("/updateApi", verifyTokenAdmin, validateUpdate, updateApi);
router.post("/deleteApi", verifyTokenAdmin, deleteApi);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNoByCategory", verifyTokenAdmin, getLastSrNoByCategory);

router.post("/getAllApis", getAllApis);

module.exports = router;
