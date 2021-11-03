const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const charts = require("../controllers/charts");
const {isLoggedIn, setPostedToday, blockDuplicatePost, checkPostStreak, isAccountOwner, filterCharts} = require("../middleware");

router.route("/")
        .get( isLoggedIn, setPostedToday, filterCharts, catchAsync(charts.renderTodaysCharts));

router.route("/all")
        .get( isLoggedIn, setPostedToday, filterCharts, catchAsync(charts.renderAllCharts));
        
router.route("/me")
        .get( isLoggedIn, setPostedToday, catchAsync(charts.renderMyCharts));     

module.exports = router;