const jwt = require("jsonwebtoken");
const User = require("../models/user");
const AppError = require("../utils/AppError");
const employee = require("../models/employee");

const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            throw new AppError("Please login first", 401);
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).populate({
            path: "role",
            populate: {
                path: "permissions"
            }
        });
        if (!user) {
            throw new AppError("User not found", 401);
        }
        if (!user.isActive) {
            throw new AppError("Account is deactivated", 403);
        }
        //console.log("Logged in user");

        req.user = user;

        // console.log(req.user);
        //console.log("Role:", req.user.role);
        next();
    } catch (error) {
        return next(new AppError("Plase login first", 401));
    }
}
module.exports = verifyUser;