const User = require("../models/user");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const { generateToken, refreshToken } = require("../utils/generateToken");
const jwt = require("jsonwebtoken");

const registerService = async (data) => {
    const { email, password, role } = data;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError("User already exists", 400);
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        email,
        password: hashPassword,
        role
    });
    return newUser;
}
const refreshTokenService = async (req) => {
    const refresToken = req.cookies.refreshToken;
    if (!refresToken) {
        throw new AppError("Refresh Token Required", 401);
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(refresToken, process.env.REFRESHTOKEN_SECRET)

    }
    catch (error) {
        throw new AppError("invalid token  request", 401);
    }
    const user = await User.findById(decodedToken.id).populate({
        path: "role",
        populate: {
            path: "permissions"
        }
    });
    if (!user) {
        throw new AppError("User not found", 401);
    }
    const refToken = await refreshToken(user);
    const accessToken = await generateToken(user);
    user.refreshToken = refToken;
    await user.save();
    return { accessToken, refreshToken: refToken, user };
}
const loginService = async (data) => {
    // console.log("login service data:", data)
    const { email, password } = data;
    const user = await User.findOne({ email }).populate({
        path: "role",
        populate: {
            path: "permissions"
        }
    }).select("+password");
    // console.log("user:", user)
    if (!user) {
        throw new AppError("User not found", 401);
    }
    if (!user.isActive) {
        throw new AppError("Account is deactivated", 403);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError("Invalid email or password", 401);
    }
    user.lastLogin = Date();
    await user.save();
    const token = generateToken(user);
    const refToken = refreshToken(user);
    user.refreshToken = refToken;
    await user.save();
    user.password = undefined;
    return {
        token, refToken, user
    }
}
module.exports = { registerService, loginService, refreshTokenService };