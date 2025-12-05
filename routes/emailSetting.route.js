const express = require("express");
const router = express.Router();

const {
  updateEmailSettings,
  getEmailSettings,
} = require("../controllers/emailSetting.controller");

const { verifyTokenAdmin } = require("../middlewares/admin.auth");
const validation = require("../validations/emailSetting.validation");

router.post(
  "/updateEmailSettings",
  verifyTokenAdmin,
  validation.emailSettingsValidator,
  updateEmailSettings
);
router.get("/getEmailSettings", getEmailSettings);

module.exports = router;
