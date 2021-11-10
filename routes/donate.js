const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {isLoggedIn, isVerified} = require("../middleware");


const renderDonatePage = async (req, res) =>{
    res.render("donate/show", {title: "Donate/ t'day"})
}


const renderThankYou = async (req, res) => {
    res.render("donate/confirm", {title: "Thank you!/ t'day"})
}

router.get("/", isLoggedIn, isVerified, catchAsync(renderDonatePage))
   
router.get("/confirmation", isLoggedIn, isVerified, catchAsync(renderThankYou))

module.exports = router;