const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const users = require("../controllers/users");
const {
    isLoggedIn, 
    isVerified, 
    alreadyVerified, 
    correctCookies, 
    setPostedToday, 
    resetPostStreak, 
    isAccountOwner,
    filterPosts
} = require("../middleware");
const multer = require("multer");
const {storage} = require("../cloudinary");
const upload = multer({storage});

// --------------- REGISTER ROUTE ---------------

router.route("/register")
    .get(users.renderRegisterForm) // Render registration form
    .post(upload.single("avatar"), catchAsync(users.register)); // Handle registration form submission

// --------------- VERIFY ROUTES ---------------

router.route("/verify")
    .get(isLoggedIn, alreadyVerified, users.renderVerify) // Render verification form
    .put(isLoggedIn, users.putVerify); // Handle verification form submission

router.route("/verify/:token")
    .get(users.putVerified); // Handle verification

// --------------- LOGIN ROUTE ---------------

router.route("/login")
    .get(users.renderLoginForm) // Render login form
    .post((req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                console.log("Login failed", { username: req.body.username, info });
                req.flash("error", info?.message || "Password or username is incorrect.");
                return res.redirect("/login");
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                return users.login(req, res, next);
            });
        })(req, res, next);
    }); // Handle login form submission

// --------------- LOGOUT ROUTE ---------------
router.get("/logout", users.logout);

// --------------- FORGOT PASSWORD ROUTE ------
router.route("/forgot-password")
    .get(users.getForgotPw) // Render forgot password form
    .put(catchAsync(users.putForgotPw)); // Handle forgot password form submission

// --------------- RESET PASSWORD ROUTE -------
router.route("/reset/:token")
    .get(catchAsync(users.getReset)) // Render reset password form
    .put(catchAsync(users.putReset)); // Handle reset password form submission

// --------------- HOME ROUTE ---------------
router.get("/home", 
    isLoggedIn, 
    isVerified, 
    correctCookies, 
    setPostedToday, 
    resetPostStreak, 
    catchAsync(filterPosts), 
    catchAsync(users.renderHomePage)
)

// --------------- PROFILE ROUTE ---------------
router.route("/profile")
    .get(
        isLoggedIn, 
        isVerified, 
        isAccountOwner,  
        setPostedToday, 
        resetPostStreak, 
        catchAsync(users.showUserProfile) 
    ) // Render user profile
    .put(
        isLoggedIn, 
        isVerified, upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverPhoto', maxCount: 1 }
        ]), catchAsync(users.updateProfile))// Handle updating user profile
    .delete(
        isLoggedIn, 
        isVerified, 
        isAccountOwner, 
        catchAsync(users.deleteAccount)
    ); // Handle deleting user account

// --------------- SETTINGS ROUTES ---------------
router.route("/settings")
    .get(
        isLoggedIn, 
        isVerified, 
        isAccountOwner, 
        catchAsync(users.showUserSettings)
    )// Render user settings
    .put(
        isLoggedIn, 
        isVerified, 
        isAccountOwner, 
        catchAsync(users.updateUserInfo)
    ); // Handle updating user settings

// Change Password Route
router.put("/settings/password", isVerified, isLoggedIn, isAccountOwner, catchAsync(users.changePassword));

module.exports = router;
