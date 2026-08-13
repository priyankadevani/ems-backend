const mongoose = require("mongoose");

const designationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Designation name is required"],
            trim: true,
            unique: true,
            minlength: [2, "Designation name must be at least 2 characters"],
            maxlength: [50, "Designation name cannot exceed 50 characters"]
        },

        description: {
            type: String,
            trim: true,
            default: "",
            maxlength: [250, "Description cannot exceed 250 characters"]
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

module.exports = mongoose.model("Designation", designationSchema);