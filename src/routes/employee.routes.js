
const router = require("express").Router();
const upload = require("../middleware/upload.middleware");

const { getallemployee, createEmployee, getEmployee, updateEmployee, deleteEmployee } = require("../controllers/employee.controller");
const verifyUser = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

router.get("/", verifyUser, authorize('employee.read'), getallemployee);
router.post("/", verifyUser, authorize('employee.create'), upload.single("profileImage"), createEmployee);
router.get("/:id", verifyUser, authorize('employee.read'), getEmployee);
router.put("/:id", verifyUser, authorize('employee.update'), upload.single("profileImage"), updateEmployee);
router.delete("/:id", verifyUser, authorize('employee.delete'), deleteEmployee);

module.exports = router;