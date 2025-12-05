const express = require("express");
const router = express.Router();
const {
  validateCreate,
} = require("../validations/event.validation");
const {
  createEvent,
  updateEvent,
  listAllEvent,
  deleteEvent,
  updateStatus,
  getActiveEvent
} = require("../controllers/event.controller");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");

router.post(
  "/createApi",
  verifyTokenAdmin,
  validateCreate,
  createEvent
);
router.put(
  "/updateApi/:pageId",
  verifyTokenAdmin,
  validateCreate,
  updateEvent
);
router.delete("/deleteApi/:eventId", verifyTokenAdmin, deleteEvent);
router.post("/getPaginationData", verifyTokenAdmin, listAllEvent);
router.post("/status", verifyTokenAdmin, updateStatus);
router.get("/active",getActiveEvent)

module.exports = router;
