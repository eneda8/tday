const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const countries = require("../countries");

router.get("/register", (req, res) => {
    if (req.isAuthenticated()) {
        req.flash("error", "You are already logged in!");
        return res.redirect('/today');
    }
    res.render("users/register", {countries})
});

router.post("/register", catchAsync(async (req,res, next) => {
    try{
        const {email, username, password, birthday, gender, country } = req.body;
        const user = new User({email, username, birthday, gender, country});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash("success", `Welcome to todai, ${req.user.username}!`);
            res.redirect("/today");
        })
    } catch(e) {
        req.flash("error", `${e.message}.`, "Please try again!");
        res.redirect("/register")
    }
}));

router.get("/login", (req,res) => {
    if (req.isAuthenticated()) {
        req.flash("error", "You are already logged in!");
        return res.redirect('/today');
    }
    res.render("users/login")
})

router.post("/login", passport.authenticate("local", {failureFlash: "Incorrect username or password. Please try again.", failureRedirect: "/login", }), (req,res) => {
    req.flash("success", `Welcome back!`)
    const redirectUrl = req.session.returnTo || "/";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get("/logout", (req,res) => {
    req.logout();
    req.flash("success", "Goodbye!");
    res.redirect("/");
})
module.exports = router;