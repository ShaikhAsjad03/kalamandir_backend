const express = require("express");
const router = express.Router();
const {
  validateCreate,
  validateUpdate,
} = require("../validations/videos.validation");
const {
  createVideo,
  updateVideo,
  deleteVideo,
  getPaginationData,
  getDataById,
  getAllVideos,
  getLastSrNo,
} = require("../controllers/videos.controller");

const { verifyTokenAdmin } = require("../middlewares/admin.auth");

router.post(
  "/createVideo",
  verifyTokenAdmin,
  validateCreate,
  createVideo
);
router.post(
  "/updateVideo",
  verifyTokenAdmin,
  validateUpdate,
  updateVideo
);
router.post("/deleteVideo", verifyTokenAdmin, deleteVideo);
router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
router.post("/getDataById", verifyTokenAdmin, getDataById);
router.post("/getLastSrNo", verifyTokenAdmin, getLastSrNo);

router.post("/getAllVideos", getAllVideos);

module.exports = router;
