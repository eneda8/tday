const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");
const {isLoggedIn, setPostedToday, blockDuplicatePost} = require("../middleware");
const multer = require("multer");
const {storage} = require("../cloudinary");
const upload = multer({storage});

router.route("/")
    .get(users.renderHomePage)
    .post(passport.authenticate("local", {failureFlash: true, failureRedirect: "/login", }), users.login)

router.get("/data", (req,res) => {
    res.render("data");
})

router.route("/register")
    .get(users.renderRegisterForm)
    .post(upload.single("avatar"), catchAsync(users.register));

router.route("/login")
    .get(users.renderLoginForm)
    .post(passport.authenticate("local", {failureFlash: true, failureRedirect: "/login", }), users.login)

router.get("/logout", users.logout);

router.get("/u/:username", isLoggedIn, setPostedToday, catchAsync(users.showUserProfile));

router.route("/settings")
    .get(isLoggedIn, setPostedToday, catchAsync(users.showUserSettings))
    .put(isLoggedIn, setPostedToday, upload.single("avatar"), catchAsync(users.updateUserSettings))

module.exports = router;