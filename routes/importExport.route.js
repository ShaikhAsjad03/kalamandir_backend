const express = require("express");
const router = express.Router();
const { uploadExcel, uploadZip } = require("../middlewares/upload");
const { importProducts, exportProducts, importZipImages } = require("../controllers/importExport.controller");

router.post("/import", uploadExcel, importProducts);
router.post("/export", exportProducts);
router.post("/import-images", uploadZip, importZipImages);

module.exports = router;