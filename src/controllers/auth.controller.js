const { registerService, loginService, refreshTokenService } = require("../services/auth.service");
const User = require("../models/user");
const Employee = require("../models/employee");
const registerUser = async (req, res, next) => {
    try {
        const user = await registerService(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: user._id,
                email: user.email
            }
        })

    } catch (error) {
        next(error);
    }
}
const loginUser = async (req, res, next) => {
    try {
        //console.log(req.body);
        const { token, refToken, user } = await loginService(req.body);
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 10 * 60 * 1000
        });
        res.cookie("refreshToken", refToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 60 * 1000
        })
        const employee = await Employee.findOne({ userId: user._id });
        if (!employee) {
            throw new AppError("Employee not found", 401);
        }
        res.status(201).json({
            success: true,
            message: "Login successfully",
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: employee?.firstName,
                    lastName: employee?.lastName,
                    profileImage: employee?.profileImage,
                    role: {
                        id: user.role._id,
                        roleName: user.role.roleName
                    },
                    permissions: user.role.permissions.map(permission => (
                        {
                            id: permission._id,
                            name: permission.name
                        }
                    ))
                }
            }
        })
    }
    catch (error) {
        next(error);
    }
}

const getCurrentUser = async (req, res, next) => {
    try {

        const user = req.user;
        const employee = await Employee.findOne({ userId: user._id });
        if (!employee) {
            throw new AppError("Employee not found", 401);
        }


        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: employee?.firstName,
                    lastName: employee?.lastName,
                    profileImage: employee?.profileImage,
                    role: {
                        id: user.role._id,
                        roleName: user.role.roleName
                    },
                    permissions: user.role.permissions.map(permission => ({
                        id: permission._id,
                        name: permission.name
                    }))
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

const refreshToken = async (req, res, next) => {
    try {

        const { accessToken, refreshToken, user } = await refreshTokenService(req);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 10 * 60 * 1000
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 60 * 1000
        })
        // console.log("sending refresh response    ", user.email);
        const employee = await Employee.findOne({ userId: user._id });
        if (!employee) {
            throw new AppError("Employee not found", 401);
        }
        //  console.log("User:", user.email);
        return res.status(200).json({
            success: true,
            accessToken,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: employee?.firstName,
                    lastName: employee?.lastName,
                    profileImage: employee?.profileImage,
                    role: {
                        id: user.role._id,
                        roleName: user.role.roleName,

                    },
                    permissions: user.role.permissions.map(permission => ({
                        id: permission._id,
                        name: permission.name
                    }))
                }

            }
        })
    } catch (error) {
        console.error("REFRESH ERROR:");
        console.error(error);
        next(error);
    }
}

const getUserProfile = async (req, res, next) => {
    try {

        const employee = await Employee.findOne({
            userId: req.user._id
        })
            .populate("department", "name")
            .populate("designation", "name");
        const user = await User.findById(req.user._id)
            .populate("role", "roleName")
        if (!employee) {
            throw new AppError("Profile not found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: {
                id: employee._id,
                fname: employee.firstName,
                lname: employee.lastName,
                email: user.email,
                phone: employee.phone,
                department: employee.department?.name,
                designation: employee.designation?.name,
                jiningDate: employee.joiningDate,
                salary: employee.salary,
                role: user.role.roleName,
                profileImage: employee.profileImage
            }
        });

    } catch (error) {
        next(error);
    }
};
const updateProfile = async (req, res, next) => {
    try {

        const employee = await Employee.findOne({
            userId: req.user._id
        });

        if (!employee) {
            throw new AppError("Profile not found", 404);
        }

        const {
            firstName,
            lastName,
            phone
        } = req.body;

        employee.firstName = firstName;
        employee.lastName = lastName;
        employee.phone = phone;

        await employee.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: employee
        });

    } catch (error) {
        next(error);
    }
};



const logoutUser = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (token) {
            const user = await User.findOne({ refreshToken: token });
            if (user) {
                user.refreshToken = undefined;
                await user.save({ validateBeforeSave: false });
            }
        }
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        res.status(200).json({
            success: true,
            message: "Logout successfully"
        })
    }
    catch (error) {
        next(error);
    }

}
module.exports = { updateProfile, registerUser, loginUser, logoutUser, refreshToken, getCurrentUser, getUserProfile };