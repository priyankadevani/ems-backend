const express = require("express");
const attendanceController = require("../controllers/attendance.controller");
const verifyUser = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

const router = express.Router();

router.post("/", verifyUser, authorize("attendance.self"), attendanceController.checkIn);
router.put("/", verifyUser, authorize("attendance.self"), attendanceController.checkOut);
router.get("/myToday", verifyUser, authorize("attendance.self"), attendanceController.myTodayAttendance);
router.get("/myAttendance", verifyUser, authorize("attendance.self"), attendanceController.attendanceSelf);


router.get("/today", verifyUser, authorize("attendance.team"), attendanceController.attendanceToday);
router.get("/attendancehistory", verifyUser, authorize("attendance.team"), attendanceController.attendanceHistory);

router.get("/organization/today", verifyUser, authorize("attendance.organization"), attendanceController.organizationAttendanceToday);
router.get("/organization/attendancehistory", verifyUser, authorize("attendance.organization"), attendanceController.organizationAttendanceHistory);

module.exports = router;