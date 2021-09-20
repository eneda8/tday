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

router.get("/home", isLoggedIn, setPostedToday, catchAsync(users.renderHomePage))
    .post(isLoggedIn, upload.single("image"), validatePost, setPostedToday, blockDuplicatePost, catchAsync(posts.createPost));

router.route("/register")
    .get(users.renderRegisterForm)
    .post(upload.single("avatar"), catchAsync(users.register));

router.route("/login")
    .get(users.renderLoginForm)
    .post(passport.authenticate("local", {failureFlash: true, failureRedirect: "/login", }), users.login)

router.get("/logout", users.logout);

router.get("/u/:username", isLoggedIn, setPostedToday, checkPostStreak, catchAsync(users.showUserProfile));

router.delete("/u/:username/delete", isLoggedIn, isAccountOwner, catchAsync(users.deleteAccount));

router.route("/settings")
    .get(isLoggedIn, setPostedToday, catchAsync(users.showUserSettings))
    .put(isLoggedIn, setPostedToday, upload.single("avatar"), catchAsync(users.updateUserSettings))

module.exports = router;