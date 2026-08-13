const router = require("express").Router();
const { getDesignationById, updateDesignation, getDesignationDropDown, deleteDesignation, createDesignation, getAllDesignations } = require("../controllers/designation.controller");
const verifyUser = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

router.post("/", verifyUser, authorize("designation.create"), createDesignation);
router.get("/", verifyUser, authorize("designation.read"), getAllDesignations);
router.get("/dropdown", verifyUser, authorize("designation.read"), getDesignationDropDown);
router.get("/:id", verifyUser, authorize("designation.read"), getDesignationById);
router.put("/:id", verifyUser, authorize("designation.update"), updateDesignation);
router.delete("/:id", verifyUser, authorize("designation.delete"), deleteDesignation)
module.exports = router;