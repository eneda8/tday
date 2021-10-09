const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");
const posts = require("../controllers/posts");
const {isLoggedIn, setPostedToday, blockDuplicatePost, checkPostStreak, isAccountOwner} = require("../middleware");

router.route("/data")
        .get( isLoggedIn, setPostedToday, catchAsync(data.renderData));
