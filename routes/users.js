const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");
const posts = require("../controllers/posts");
const {isLoggedIn, setPostedToday, validatePost, blockDuplicatePost, checkPostStreak, isAccountOwner} = require("../middleware");
const multer = require("multer");
const {storage} = require("../cloudinary");
const upload = multer({storage});

router.route("/")
    .get(users.renderLandingPage)
    .post(passport.authenticate("local", {failureFlash: true, failureRedirect: "/login", }), users.login)

router.get("/home", isLoggedIn, setPostedToday, checkPostStreak, catchAsync(users.renderHomePage))

router.route("/register")
    .get(users.renderRegisterForm)
    .post(upload.single("avatar"), catchAsync(users.register));

router.route("/login")
    .get(users.renderLoginForm)
    .post(passport.authenticate("local", {failureFlash: true, failureRedirect: "/login", }), users.login)

router.get("/logout", users.logout);

router.route("/u/:username")
        .get(isLoggedIn, setPostedToday, checkPostStreak, catchAsync(users.showUserProfile))
        .put(isLoggedIn, upload.single("avatar"), catchAsync(users.updateProfile))
        .delete(isLoggedIn, isAccountOwner, catchAsync(users.deleteAccount));


router.get("/settings", isLoggedIn, isAccountOwner, catchAsync(users.showUserSettings));

router.put("/settings/", isLoggedIn, isAccountOwner, catchAsync(users.updateUserInfo));

router.put("/settings/password", isLoggedIn, isAccountOwner, catchAsync(users.changePassword));

module.exports = router;