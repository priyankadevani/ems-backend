const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User id is required"]
        },
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true
        },
        managerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            minlength: 10,
            maxlength: 10,
            trim: true
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: [true, "Department is required"]
        },
        joiningDate: {
            type: Date,
            required: [true, "Joining date is required"]
        },
        salary: {
            type: Number,
            required: [true, "Salary is required"],
            min: 0
        },
        designation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Designation",
            required: [true, "Designation is required"]
        },
        profileImage: {
            url: {
                type: String,
                default: ""
            },
            key: {
                type: String,
                default: ""
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Employee", employeeSchema);