const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {isLoggedIn, isVerified} = require("../middleware");

const renderDonatePage = async (req, res) =>{
    res.render("donate/show", {title: "Donate/ t'day", style: "styles"})
}

router.get("/", isLoggedIn, isVerified, catchAsync(renderDonatePage))
   
module.exports = router;