const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
    {
        roleName: {
            type: String,
            required: [true, "Role name is required"],
            unique: true,
            trim: true
        },
        permissions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Permission'
            }
        ],
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model("Role", roleSchema);