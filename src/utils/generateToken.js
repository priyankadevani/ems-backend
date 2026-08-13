const jwt = require("jsonwebtoken");
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id
            //  role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES
        }
    )
}

const refreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id
        },
        process.env.REFRESHTOKEN_SECRET,
        {
            expiresIn: process.env.REFRESHTOKEN_EXPIRES
        }
    )
}
module.exports = { generateToken, refreshToken };