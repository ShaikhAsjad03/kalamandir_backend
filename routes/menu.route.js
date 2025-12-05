const express = require("express");
const router = express.Router();
const {
  validateCreate,
  validateUpdate,
} = require("../validations/menu.validation");
const {
  createMenu,
  updateMenu,
  deleteMenu,
  getPaginationData,
  getPaginationParentData,
  getDataById,
  getAllMenus,
  getLastSrNo,
  getLastParentSrNo,
  getMenus,
} = require("../controllers/menu.controller");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");
const { uploadMenu } = require("../middlewares/upload");

router.post("/createMenu", verifyTokenAdmin, validateCreate, uploadMenu, createMenu);
router.post("/updateMenu", verifyTokenAdmin, validateUpdate, uploadMenu, updateMenu);
router.post("/deleteMenu", verifyTokenAdmin, deleteMenu);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post(
  "/getPaginationParentData",
  verifyTokenAdmin,
  getPaginationParentData
);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);
router.post("/getLastParentSrNo", verifyTokenAdmin, getLastParentSrNo);

router.get("/getAllMenus", getAllMenus);
router.get("/getMenus", getMenus);

module.exports = router;
