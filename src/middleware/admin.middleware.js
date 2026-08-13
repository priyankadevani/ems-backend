const AppError = require("../utils/AppError");

const isAdmin = (req, res, next) => {
    try {
        if (!req.user || !req.user.role || !req.user.role.roleName) {
            return next(new AppError("Access denied: Admin role required", 403));
        }

        if (req.user.role.roleName.toLowerCase() !== "admin") {
            return next(new AppError("Access denied: Admin role required", 403));
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = isAdmin;
