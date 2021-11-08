const express = require("express");
const router = express.Router();
const index = require("../controllers/index");

router.route("/")
    .get(index.renderLandingPage)
    // .post(passport.authenticate("local", {failureFlash: true, failureRedirect: "/login", }), index.login)

 router.route("/about")
    .get(index.renderAbout)   

module.exports = router;