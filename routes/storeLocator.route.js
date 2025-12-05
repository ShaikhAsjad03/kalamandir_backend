const express = require("express");
const router = express.Router();

const { validateCreate, validateUpdate } = require("../validations/storeLocator.validation");

const {
  createStoreLocator,
  updateStoreLocator,
  deleteStoreLocator,
  getPaginationData,
  getDataById,
  getAllStoreLocator,
  getLastSrNo,
} = require("../controllers/storeLocator.controller");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");
const { uploadStoreLocator } = require("../middlewares/upload");

router.post("/createStoreLocator", verifyTokenAdmin, uploadStoreLocator, validateCreate, createStoreLocator);
router.post("/updateStoreLocator", verifyTokenAdmin, uploadStoreLocator, validateUpdate, updateStoreLocator);
router.post("/deleteStoreLocator", verifyTokenAdmin, deleteStoreLocator);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);

router.post("/getAllStoreLocator", getAllStoreLocator);

module.exports = router;
