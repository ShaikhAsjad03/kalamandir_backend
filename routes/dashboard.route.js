const express = require("express");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");
const {
  dashboardStats,
  inquiryData,
} = require("../controllers/dashboard.controller");
const router = express.Router();

router.get("/count", verifyTokenAdmin, dashboardStats);
router.get("/inquiry", verifyTokenAdmin, inquiryData);

module.exports = router;
