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
    .post(passport.authenticate("local", {failureFlash: "Incorrect username or password. Please try again.", failureRedirect: "/login", }), users.login)

router.get("/data", (req,res) => {
    res.render("data");
})

router.route("/register")
    .get(users.renderRegisterForm)
    .post(upload.single("avatar"), catchAsync(users.register));

router.route("/login")
    .get(users.renderLoginForm)
    .post(passport.authenticate("local", {failureFlash: true, failureRedirect: "/login", }), users.login);

// router.post('/login', function async (req, res, next) {
//   const user = req.body;
//   passport.authenticate('local', function(err, user, info) {
//     if (err) { console.log(err); return next(err); }
//     if (!user) { 
//       console.log("!user")
//       res.redirect('/login'); 
//     }
//     req.logIn(user, function(err) {
//       if (err) { 
//       console.log("logIn error", err); 
//       req.flash("error", `${info.message}`)
//       res.redirect("/login"); 
//     }
//       return res.redirect('/u/' + user.username);
//     });
//   })(req, res, next);
// });

router.get("/logout", users.logout);

router.get("/u/:username", isLoggedIn, setPostedToday, catchAsync(users.showUserProfile));

router.route("/settings")
    .get(isLoggedIn, setPostedToday, catchAsync(users.showUserSettings))
    .put(isLoggedIn, setPostedToday, upload.single("avatar"), catchAsync(users.updateUserSettings))

module.exports = router;