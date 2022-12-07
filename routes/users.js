const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const users = require("../controllers/users");
const {isLoggedIn, isVerified, alreadyVerified, correctCookies, setPostedToday, checkPostStreak, isAccountOwner, filterPosts} = require("../middleware");
const multer = require("multer");
const {storage} = require("../cloudinary");
const upload = multer({storage});
// const User = require("../models/user");
// const countries = require("../countries");


router.route("/register")
    .get(users.renderRegisterForm)
    .post(upload.single("avatar"), catchAsync(users.register));

router.route("/verify")
    .get(isLoggedIn, alreadyVerified, users.renderVerify)
    .put(isLoggedIn, users.putVerify);

router.route("/verify/:token")
    .get(users.putVerified)

router.route("/login")
    .get(users.renderLoginForm)
    .post(passport.authenticate("local", {failureFlash: true, failureRedirect: "/login", }), users.login)

router.get("/logout", users.logout);

router.route("/forgot-password")
    .get(users.getForgotPw)
    .put(catchAsync(users.putForgotPw));

router.route("/reset/:token")
    .get(catchAsync(users.getReset))
    .put(catchAsync(users.putReset));

router.get("/home", isLoggedIn, isVerified, correctCookies, setPostedToday, checkPostStreak, catchAsync(filterPosts), catchAsync(users.renderHomePage))

// router.route("/u/:username")
//         .get(isLoggedIn, isVerified, setPostedToday, checkPostStreak, catchAsync(users.showUserProfile))
//         .put(isLoggedIn, isVerified, upload.fields([
//             { name: 'avatar', maxCount: 1 },
//             { name: 'coverPhoto', maxCount: 1 }
//           ]), catchAsync(users.updateProfile))
//         .delete(isLoggedIn, isVerified, isAccountOwner, catchAsync(users.deleteAccount));

router.route("/profile")
    .get(isLoggedIn, isVerified, isAccountOwner,  setPostedToday, checkPostStreak, catchAsync(users.showUserProfile))
    .put(isLoggedIn, isVerified, upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverPhoto', maxCount: 1 }
        ]), catchAsync(users.updateProfile))
    .delete(isLoggedIn, isVerified, isAccountOwner, catchAsync(users.deleteAccount));

router.route("/settings")
    .get(isLoggedIn, isVerified, isAccountOwner, catchAsync(users.showUserSettings))
    .put(isLoggedIn, isVerified, isAccountOwner, catchAsync(users.updateUserInfo));

router.put("/settings/password", isVerified, isLoggedIn, isAccountOwner, catchAsync(users.changePassword));

module.exports = router;