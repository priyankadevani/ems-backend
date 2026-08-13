const Attendance = require("../models/attendance");
const Employee = require("../models/employee");
const AppError = require("../utils/AppError");

const checkIn = async (userid) => {
    const employee = await Employee.findOne({ userId: userid });
    // console.log(userid);
    if (!employee) {
        throw new AppError("Employee not found", 404);
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
        employeeId: employee._id,
        date: today
    });
    if (existingAttendance) {
        //console.log("in if loop already checked in");
        throw new AppError("You have already checked in", 400);
    }
    const attendance = new Attendance({
        employeeId: employee._id,
        date: today,
        checkIn: new Date(),
        status: "Pending"
    });
    await attendance.save();
    return {
        message: "Check in successful",
        attendance
    };
}

const checkOut = async (empid) => {
    const employee = await Employee.findOne({ userId: empid });
    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tommorrow = new Date(today);
    tommorrow.setDate(today.getDate() + 1);

    const attendance = await Attendance.findOne({
        employeeId: employee._id,
        date: {
            $gte: today,
            $lt: tommorrow
        }
    })
    if (!attendance) {
        throw new AppError("Please check in first", 400);

    } if (attendance.checkOut) {
        throw new AppError("You have already checked out", 400);
    }
    attendance.checkOut = new Date();

    const hours = (attendance.checkOut - attendance.checkIn) / (60 * 60 * 1000);
    attendance.workingHours = Number(hours.toFixed(2));

    let status = "Pending";
    if (attendance.workingHours >= 8) {
        status = "Present"
    }
    else if (attendance.workingHours < 8 && attendance.workingHours > 4) {
        status = "Half Day"
    }
    else {
        status = "Absent"
    }
    attendance.status = status;

    await attendance.save();
    return attendance;
}

const myTodayAttendance = async (userId) => {

    const employee = await Employee.findOne({ userId });

    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.findOne({
        employeeId: employee._id,
        date: {
            $gte: today,
            $lt: tomorrow
        }
    });

    return attendance;
};

const attendanceSelf = async (userId) => {
    const employee = await Employee.findOne({ userId: userId });
    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    const attendance = await Attendance.find({ employeeId: employee._id }).sort({ date: -1 });

    return attendance;
}

//team
const attendanceToday = async (userId) => {
    // console.log(userId);
    const employees = await Employee.find({ managerId: userId });
    // console.log("employees:", employees);

    const employeeIds = employees.map(
        employee => employee._id
    )
    // console.log("empid:", employeeIds);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tommorrow = new Date(today);
    tommorrow.setDate(today.getDate() + 1);

    const attendance = await Attendance.find({
        employeeId: {
            $in: employeeIds
        },
        date: {
            $gte: today,
            $lt: tommorrow
        }
    }).populate(
        "employeeId",
        "firstName lastName email department designation"
    )
        .sort({ checkIn: 1 });

    return attendance;

}
const attendanceHistory = async (userId) => {
    const employees = await Employee.find({
        managerId: userId
    });

    const employeeIds = employees.map(
        employee => employee._id
    );

    const attendance = await Attendance.find({
        employeeId: {
            $in: employeeIds
        }
    })
        .populate(
            "employeeId",
            "firstName lastName email department designation"
        )
        .sort({ date: -1 });

    return attendance;
}
const organizationAttendanceToday = async () => {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const attendance = await Attendance.find({
        date: {
            $gte: today,
            $lt: tomorrow
        }
    })
        .populate(
            "employeeId",
            "firstName lastName email department designation"
        )
        .sort({ checkIn: 1 });

    return attendance;
};

const organizationAttendanceHistory = async () => {

    const attendance = await Attendance.find({})
        .populate(
            "employeeId",
            "firstName lastName email department designation"
        )
        .sort({ date: -1 });

    return attendance;
};





module.exports = { checkIn, checkOut, attendanceToday, attendanceSelf, myTodayAttendance, attendanceHistory, organizationAttendanceToday, organizationAttendanceHistory };