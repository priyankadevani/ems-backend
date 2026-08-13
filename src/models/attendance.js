const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        default: null

    },
    workingHours: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["Pending", "Present", "Absent", "Late", "Half Day"],
        default: "Pending"
    },
    remarks: {
        type: String,
        trim: true,
        default: ""
    }
},
    {
        timestamps: true
    });

attendanceSchema.index(
    { employeeId: 1, date: 1 },
    { unique: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);