const express = require("express");
const router = express.Router();
const index = require("../controllers/index");
const catchAsync = require("../utils/catchAsync");
const {correctCookies, isLoggedIn, isVerified} = require("../middleware");

router.route("/")
    .get(correctCookies, index.renderLandingPage)

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
    .post(isLoggedIn, isVerified, catchAsync(index.postContact))
    
module.exports = router;