const {
    createPermissionService,
    getAllPermissionsService,
    getPermissionByIdService,
    updatePermissionService,
    deletePermissionService
} = require("../services/permission.service");

const createPermission = async (req, res, next) => {
    try {
        const permission = await createPermissionService(req.body);
        res.status(201).json({
            success: true,
            message: "Permission created successfully",
            data: permission
        });
    } catch (error) {
        next(error);
    }
};

const getAllPermissions = async (req, res, next) => {
    try {
        const permissions = await getAllPermissionsService();
        res.status(200).json({
            success: true,
            message: "Permissions fetched successfully",
            data: permissions
        });
    } catch (error) {
        next(error);
    }
};

const getPermissionById = async (req, res, next) => {
    try {
        const permission = await getPermissionByIdService(req.params.id);
        res.status(200).json({
            success: true,
            message: "Permission fetched successfully",
            data: permission
        });
    } catch (error) {
        next(error);
    }
};

const updatePermission = async (req, res, next) => {
    try {
        const permission = await updatePermissionService(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Permission updated successfully",
            data: permission
        });
    } catch (error) {
        next(error);
    }
};

const deletePermission = async (req, res, next) => {
    try {
        await deletePermissionService(req.params.id);
        res.status(200).json({
            success: true,
            message: "Permission deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPermission,
    getAllPermissions,
    getPermissionById,
    updatePermission,
    deletePermission
};