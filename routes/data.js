const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const data = require("../controllers/data");
const {isLoggedIn, setPostedToday, blockDuplicatePost, checkPostStreak, isAccountOwner} = require("../middleware");

router.route("/")
        .get( isLoggedIn, setPostedToday, catchAsync(data.renderTodayData));

router.route("/all")
        .get( isLoggedIn, setPostedToday, catchAsync(data.renderAllData));
        
router.route("/me")
        .get( isLoggedIn, setPostedToday, catchAsync(data.renderMyData));     

module.exports = router;