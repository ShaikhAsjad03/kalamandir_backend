const express = require("express");
const router = express.Router();
const {instaFeed,} = require("../controllers/instaFeed.controller");
router.post("/feed",  instaFeed);
module.exports = router;