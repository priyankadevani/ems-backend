const AppError = require("../utils/AppError");
const checkPermission = (permissionName) => {

    return (req, res, next) => {

        try {

            if (!req.user) {
                return next(
                    new AppError(
                        "Unauthorized",
                        401
                    )
                );
            }


            const permissions =
                req.user.role.permissions;


            const hasPermission =
                permissions.some(
                    permission =>
                        permission.name === permissionName
                );


            if (!hasPermission) {

                return next(
                    new AppError(
                        "Permission denied",
                        403
                    )
                );

            }


            next();


        } catch (error) {

            next(error);

        }

    }

}


module.exports = checkPermission;