const router = require("express").Router();
const {
    createPermission,
    getAllPermissions,
    getPermissionById,
    updatePermission,
    deletePermission
} = require("../controllers/permission.controller");
const verifyUser = require("../middleware/auth.middleware");
//const isAdmin = require("../middleware/admin.middleware");
const checkPermission = require("../middleware/permission.middleware");

// CRUD routes for permissions - only accessible to Admins
router.post("/", verifyUser, checkPermission("permission.create"), createPermission);
router.get("/", verifyUser, checkPermission("permission.read"), getAllPermissions);
router.get("/:id", verifyUser, checkPermission("permission.read"), getPermissionById);
router.put("/:id", verifyUser, checkPermission("permission.update"), updatePermission);
router.delete("/:id", verifyUser, checkPermission("permission.delete"), deletePermission);

module.exports = router;