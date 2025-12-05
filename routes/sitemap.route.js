const express = require("express");
const router = express.Router();
const sitemapController=require("../controllers/sitemap.controller")
const { verifyTokenAdmin } = require("../middlewares/admin.auth");
router.get("/getApi", verifyTokenAdmin, sitemapController.sitemap);
module.exports = router;