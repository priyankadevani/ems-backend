const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Department name is required"],
            trim: true,
            unique: true,
            minlength: [2, "Department name must be at least 2 characters"],
            maxlength: [50, "Department name cannot exceed 50 characters"],

        },

        description: {
            type: String,
            trim: true,
            maxlength: [250, "Description cannot exceed 250 characters"],
            default: "",
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Department", departmentSchema);