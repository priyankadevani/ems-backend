const role = require("../models/role");
//const Role = require("../models/role");
const { createRoleService, getAllRolesService, deleteRoleService } = require("../services/role.service");
const AppError = require("../utils/AppError");
const createRole = async (req, res, next) => {
    try {
        const role = await createRoleService(req.body);
        res.status(201).json({
            success: true,
            message: "Role created successfully",
            data: {
                role: role
            }
        })

    } catch (error) {
        next(error);
    }
}
const getRoles = async (req, res, next) => {
    try {
        const roles = await getAllRolesService();
        res.status(201).json({
            success: true,
            message: "Roles fetched successfully",
            data: {
                roles: roles
            }
        })

    } catch (error) {
        next(error);
    }
}
const updateRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { roleName, permissions } = req.body;

        const Role = await role.findById(id);
        if (!Role) {
            return next(new AppError(`Role not found`, 404))
        }
        const existingName = await role.findOne(
            {
                roleName: roleName.trim(),
                _id: { $ne: id }
            }
        )
        if (existingName) {
            return next(new AppError(`Role name already exists`, 400))
        }
        if (roleName) {
            Role.roleName = roleName.trim();
        }
        if (permissions) {
            Role.permissions = permissions;
        }
        await Role.save();

        const updatedRole = await role.findById(id).populate('permissions');
        res.status(200).json({
            success: true,
            message: "Role updated successfully",
            data: {
                role: updatedRole
            }
        })

    }
    catch (error) {
        next(error);
    }
}
const getRoleById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const Role = await role.findById(id).populate('permissions');
        if (!Role) {
            return next(new AppError(`Role not found`, 404))
        }
        res.status(200).json({
            success: true,
            message: "Role fetched successfully",
            data: {
                role: Role
            }
        })

    }
    catch (error) {
        next(error);
    }
}
const deleteRole = async (req, res, next) => {
    try {
        await deleteRoleService(req.params.id);
        res.status(200).json({
            success: true,
            message: "Role deleted successfully",
        })

    } catch (error) {
        next(error);
    }
}
module.exports = { createRole, getRoles, deleteRole, updateRole, getRoleById }