const express = require("express");
const router = express.Router();
const index = require("../controllers/index");
const catchAsync = require("../utils/catchAsync");
const {correctCookies, isLoggedIn, isVerified} = require("../middleware");

// Route for the root URL ("/")
router.route("/")
    .get(correctCookies, index.renderLandingPage); // GET request executes correctCookies middleware and renders the landing page

// Route for the "/about" URL path
 router.route("/about")
    .get(index.renderAbout); // GET request renders the about page  

 // Route for the "/terms" URL path
router.route("/terms")
    .get(index.renderTerms); // GET request renders the terms page

 // Route for the "/privacy" URL path
router.route("/privacy")
    .get(index.renderPrivacy); // GET request renders the privacy page

// Route for the "/cookies" URL path
router.route("/cookies")
    .get(index.renderCookies); // GET request renders the cookies page

// Route for the "/contact" URL path
router.route("/contact")
    .get(index.renderContact) // GET request renders the contact page
    .post(isLoggedIn, isVerified, catchAsync(index.postContact)); // POST request executes middleware functions and calls the postContact function
    
module.exports = router;