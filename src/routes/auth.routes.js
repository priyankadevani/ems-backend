const router = require("express").Router();

const { registerUser, loginUser, logoutUser, refreshToken, getCurrentUser, getUserProfile, updateProfile } = require("../controllers/auth.controller");
const verifyUser = require("../middleware/auth.middleware");


router.post("/register", registerUser);
router.post("/refresh-token", refreshToken)
router.post("/", loginUser);
router.post("/logout", logoutUser);
router.get("/me", verifyUser, getCurrentUser);
router.get("/profile", verifyUser, getUserProfile);
router.put("/profile", verifyUser, updateProfile);


module.exports = router;