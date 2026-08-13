const router = require("express").Router();
const { createRole, getRoles, deleteRole, getRoleById, updateRole } = require("../controllers/role.controller");
const verifyUser = require("../middleware/auth.middleware");
//const authorize = require("../middleware/authorize.middleware");
const checkPermission = require("../middleware/permission.middleware");

router.post("/", verifyUser, checkPermission("role.create"), createRole);
router.get("/", verifyUser, checkPermission("role.read"), getRoles);
router.delete("/:id", verifyUser, checkPermission("role.delete"), deleteRole);
router.put("/:id", verifyUser, checkPermission("role.update"), updateRole);
router.get("/:id", verifyUser, checkPermission("role.read"), getRoleById);

module.exports = router;