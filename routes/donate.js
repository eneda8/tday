const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {isLoggedIn} = require("../middleware");


const renderDonatePage = async (req, res) =>{
    res.render("donate/show", {title: "Donate/ t'day"})
}


const renderThankYou = async (req, res) => {
    res.render("donate/confirm", {title: "Thank you!/ t'day"})
}

router.get("/", isLoggedIn, catchAsync(renderDonatePage))
   
router.get("/confirmation", isLoggedIn, catchAsync(renderThankYou))

module.exports = router;