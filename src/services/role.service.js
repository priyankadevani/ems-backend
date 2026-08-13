const { findOne } = require("../models/employee");
const AppError = require("../utils/AppError");
const Role = require("../models/role");
const permissions = require("../models/permission");

const createRoleService = async (data) => {
    const { roleName, permissions } = data;
    const roleExists = await Role.findOne({ roleName: roleName.toLowerCase(), isActive: true });
    if (roleExists) {
        throw new AppError("Role already exists", 400)
    }
    const role = await Role.create({
        roleName,
        permissions
    });
    return role;
}
const getAllRolesService = async () => {
    const roles = await Role.find({ isActive: true }).populate('permissions');
    if (!roles) {
        throw new AppError("Roles not found", 404);
    }
    return roles;
}
const deleteRoleService = async (id) => {
    const role = await Role.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!role) {
        throw new AppError("Role not found", 404);
    }
    return role;
}
module.exports = { createRoleService, getAllRolesService, deleteRoleService }