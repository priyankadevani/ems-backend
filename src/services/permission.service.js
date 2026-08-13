const Permission = require("../models/permission");
const AppError = require("../utils/AppError");

const createPermissionService = async (data) => {
    const { name, module, action } = data;
    if (!name || !module || !action) {
        throw new AppError("Name, module, and action are required fields", 400);
    }

    const permissionExists = await Permission.findOne({ name });
    if (permissionExists) {
        throw new AppError("Permission already exists", 400);
    }

    const permission = await Permission.create({
        name,
        module,
        action
    });
    return permission;
};

const getAllPermissionsService = async () => {
    const permissions = await Permission.find();
    if (!permissions) {
        throw new AppError("Permissions not found", 404);
    }
    return permissions;
};

const getPermissionByIdService = async (id) => {
    const permission = await Permission.findById(id);
    if (!permission) {
        throw new AppError("Permission not found", 404);
    }
    return permission;
};

const updatePermissionService = async (id, data) => {
    const { name, module, action } = data;

    if (name) {
        const nameExists = await Permission.findOne({ name, _id: { $ne: id } });
        if (nameExists) {
            throw new AppError("Permission name already exists", 400);
        }
    }

    const permission = await Permission.findByIdAndUpdate(
        id,
        { name, module, action },
        { new: true, runValidators: true }
    );

    if (!permission) {
        throw new AppError("Permission not found", 404);
    }
    return permission;
};

const deletePermissionService = async (id) => {
    const permission = await Permission.findByIdAndDelete(id);
    if (!permission) {
        throw new AppError("Permission not found", 404);
    }
    return permission;
};

module.exports = {
    createPermissionService,
    getAllPermissionsService,
    getPermissionByIdService,
    updatePermissionService,
    deletePermissionService
};
