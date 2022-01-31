const express = require("express");
const router = express.Router();
const index = require("../controllers/index");
const catchAsync = require("../utils/catchAsync");
const {globalAverage} = require("../middleware");

router.route("/")
    .get(globalAverage, index.renderLandingPage)
    // .post(passport.authenticate("local", {failureFlash: true, failureRedirect: "/login", }), index.login)

 router.route("/about")
    .get(index.renderAbout)   

router.route("/terms")
    .get(index.renderTerms)

router.route("/privacy")
    .get(index.renderPrivacy)

router.route("/cookies")
    .get(index.renderCookies)
    
router.route("/contact")
    .get(index.renderContact)
    .post(catchAsync(index.postContact))
    
module.exports = router;