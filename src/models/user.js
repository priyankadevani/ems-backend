const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false
        },

        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            required: [true, "Role is required"]
        },
        isActive: {
            type: Boolean,
            default: true
        },
        refreshToken: {
            type: String,

        },

        lastLogin: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model("User", userSchema);