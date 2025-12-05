const express = require("express");
const router = express.Router();

const {
  createOrUpdateWebsiteSetting,
  getWebsiteSetting,
} = require("../controllers/websiteSetting.controller");

const { verifyTokenAdmin } = require("../middlewares/admin.auth");
const validation = require("../validations/websiteSetting.validation");
const { uploadSettings } = require("../middlewares/upload");

router.put(
  "/createOrUpdateWebsiteSetting",
  verifyTokenAdmin,
  uploadSettings,
  validation.settingsValidator,
  createOrUpdateWebsiteSetting
);
router.get("/getWebsiteSetting", getWebsiteSetting);

module.exports = router;
