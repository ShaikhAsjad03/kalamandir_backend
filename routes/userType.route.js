const express = require("express");
const router = express.Router();
const {
  validateCreate,
} = require("../validations/userType.validation");
const {
  createUserType,
  updateUserType,
  listAllUserType,
  deleteUserType,
  listAllUserTypeWithoutPagination,
} = require("../controllers/userType.controller");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");

router.post(
  "/createApi",
  verifyTokenAdmin,
  validateCreate,
  createUserType
);
router.put(
  "/updateApi/:typeId",
  verifyTokenAdmin,
  validateCreate,
  updateUserType
);
router.delete("/deleteApi/:typeId", verifyTokenAdmin, deleteUserType);
router.post("/getPaginationData", verifyTokenAdmin, listAllUserType);
router.get("/list", verifyTokenAdmin, listAllUserTypeWithoutPagination);

module.exports = router;
