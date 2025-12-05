const express = require("express");
const router = express.Router();

const {
  createPermission,
  updatePermission,
  getAllPermissions,
  getPermissionById,
  deletePermission,
  getPaginationData
} = require("../controllers/Permission.controller");
const { verifyTokenAdmin } = require("../middlewares/admin.auth");

router.post("/createApi", verifyTokenAdmin,  createPermission);
router.put("/updateApi/:id", verifyTokenAdmin, updatePermission);
router.delete("/deleteApi/:id", verifyTokenAdmin, deletePermission);
 router.post("/getPaginationData", verifyTokenAdmin, getPaginationData);
 router.get("/allow",verifyTokenAdmin,getAllPermissions)


module.exports = router;