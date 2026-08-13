const router = require("express").Router();
const verifyUser = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");
const { getAllDepartments, createDepartment, getDepartmentById, updateDepartment, deleteDepartment, getDepartmentDropDown } = require("../controllers/department.controller");

router.post("/", verifyUser, authorize("department.create"), createDepartment);
router.get("/", verifyUser, authorize("department.read"), getAllDepartments);
router.get("/dropdown", verifyUser, authorize("department.read"), getDepartmentDropDown);
router.get("/:id", verifyUser, authorize("department.read"), getDepartmentById);
router.put("/:id", verifyUser, authorize("department.update"), updateDepartment);
router.delete("/:id", verifyUser, authorize("department.delete"), deleteDepartment)
module.exports = router;