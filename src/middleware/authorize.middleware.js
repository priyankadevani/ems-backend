const User = require("../models/user");
const Permission = require("../models/permission");
const AppError = require("../utils/AppError");
// const authorize = (role) => {
//     return async (req, res, next) => {
//         console.log('Authorize middleware started');
//         console.log('Required permission:', Permission.role);
//         console.log('req.user:', req.user);
//         const user = await User.findById(req.user.id)
//             .populate({
//                 path: 'role',
//                 populate: {
//                     path: 'permissions'
//                 }
//             })
//         if (!user || !user.role) {
//             throw new AppError("Forbidden: Access denied", 403);
//         }
//         const permission = user.role.permissions.some(permission => permission.name === role);
//         if (!permission) {
//             throw new AppError("You do not have permission to perform this action", 403);
//         }
//         next();
//     }
//     // return (req, res, next) => {
//     //     if (!role.includes(req.user.role.roleName)) {
//     //         return next(
//     //             new AppError("you are not authorized to do perform this action", 403)
//     //         )
//     //     }
//     //     next();
//     // }
// }


const authorize = (...requiredPermissions) => {
    return (req, res, next) => {

        if (!req.user) {
            return next(new AppError("Unauthorized", 401));
        }

        const permissions =
            req.user.role.permissions.map(permission => permission.name);

        const hasPermission = requiredPermissions.some(permission =>
            permissions.includes(permission)
        );

        if (!hasPermission) {
            return next(
                new AppError(
                    "You don't have permission to perform this action.",
                    403
                )
            );
        }

        next();
    };
};

module.exports = authorize;