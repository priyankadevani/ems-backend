const attendanceService = require("../services/attendance.service");
const checkIn = async (req, res, next) => {
    try {
        const attendance = await attendanceService.checkIn(req.user.id);

        res.status(201).json({
            success: true,
            message: "Checked in successfully",
            data: attendance
        })
    }
    catch (error) {
        next(error)
    }
}

const checkOut = async (req, res, next) => {
    try {
        const attendance = await attendanceService.checkOut(req.user.id);

        res.status(200).json({
            success: true,
            message: "Checked out successfully",
            data: attendance
        })
    }
    catch (error) {
        next(error)
    }
}

//team
const attendanceToday = async (req, res, next) => {
    try {
        const attendance = await attendanceService.attendanceToday(req.user.id);

        res.status(200).json({
            success: true,
            message: "Attendance fetched successfully",
            data: attendance
        })
    }
    catch (error) {
        next(error)
    }
}
const attendanceHistory = async (req, res, next) => {
    try {
        const attendance = await attendanceService.attendanceHistory(req.user.id);

        res.status(200).json({
            success: true,
            message: "Attendance fetched successfully",
            data: attendance
        })
    }
    catch (error) {
        next(error)
    }
}
const myTodayAttendance = async (req, res, next) => {
    try {

        const attendance = await attendanceService.myTodayAttendance(req.user.id);

        res.status(200).json({
            success: true,
            message: "Today's attendance fetched successfully",
            data: attendance
        });

    } catch (error) {
        next(error);
    }
};

const attendanceSelf = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const attendance = await attendanceService.attendanceSelf(userId);

        res.status(200).json({
            success: true,
            message: "Attendance fetched successfully",
            data: attendance
        })
    }
    catch (error) {
        next(error)
    }

}
const organizationAttendanceToday = async (req, res, next) => {

    try {

        const attendance =
            await attendanceService.organizationAttendanceToday();

        res.status(200).json({
            success: true,
            message: "Organization attendance fetched successfully",
            data: attendance
        });

    } catch (error) {
        next(error);
    }
};


const organizationAttendanceHistory = async (req, res, next) => {

    try {

        const attendance =
            await attendanceService.organizationAttendanceHistory();

        res.status(200).json({
            success: true,
            message: "Organization attendance history fetched successfully",
            data: attendance
        });

    } catch (error) {
        next(error);
    }
};
module.exports = { checkIn, checkOut, attendanceToday, attendanceSelf, myTodayAttendance, attendanceHistory, organizationAttendanceToday, organizationAttendanceHistory }