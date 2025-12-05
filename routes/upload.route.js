const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/upload");
const {
  uploadImage,
  deleteImage,
  removeImage
} = require("../controllers/upload.controller");

router.post("/image", upload.single("image"), uploadImage);
router.delete("/image", deleteImage);
router.delete("/removeImage", removeImage);

module.exports = router;
