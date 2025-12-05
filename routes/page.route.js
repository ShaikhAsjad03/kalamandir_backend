const express = require("express");
const router = express.Router();
const {
  validateCreate,
} = require("../validations/page.validation");
const {
  createPage,
  updatePage,
  listAllPage,
  deletePage,
  listAllPageWithoutPagination,
} = require("../controllers/page.controller");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");

router.post(
  "/createApi",
  verifyTokenAdmin,
  validateCreate,
  createPage
);
router.put(
  "/updateApi/:pageId",
  verifyTokenAdmin,
  validateCreate,
  updatePage
);
router.delete("/deleteApi/:pageId", verifyTokenAdmin, deletePage);
router.post("/getPaginationData", verifyTokenAdmin, listAllPage);
router.get("/list", verifyTokenAdmin, listAllPageWithoutPagination);

module.exports = router;
