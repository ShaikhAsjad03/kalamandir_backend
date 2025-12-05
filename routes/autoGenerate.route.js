const express = require("express");
const router = express.Router();
const {autoGenerate,} = require("../controllers/autogenerate.controller");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");
router.post("/title",verifyTokenAdmin,autoGenerate);
module.exports = router;
