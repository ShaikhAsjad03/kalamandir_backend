const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getProfile,
  changePassword,
  updateStatus,
  getPaginationData,
  deleteUser,
  update,
} = require("../controllers/admin.controller");

const { verifyTokenAdmin } = require("../middlewares/admin.auth");
const validation = require("../validations/admin.validation");

router.post("/register", validation.createApi, register);
router.put("/update/:id", validation.createApi, update);
router.post("/login", validation.login, login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOtp", verifyOtp);
router.post("/resetPassword", resetPassword);
router.get("/getProfile", verifyTokenAdmin, getProfile);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/changePassword", verifyTokenAdmin, changePassword);
router.delete("/delete/:id", deleteUser);
router.post(
  "/updateStatus",
  verifyTokenAdmin,
  validation.updateStatus,
  updateStatus
);

module.exports = router;
