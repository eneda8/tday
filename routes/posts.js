const express = require("express");
const router = express.Router();
const posts = require("../controllers/posts");
const catchAsync = require("../utils/catchAsync");
const Post = require("../models/post");
const {isLoggedIn, isAuthor, validatePost} = require("../middleware");

router.route("/")
    .get(isLoggedIn, catchAsync(posts.index))
    .post(isLoggedIn, validatePost, catchAsync(posts.createPost));

router.get("/new", isLoggedIn, posts.renderNewForm);

router.get("/today", isLoggedIn, catchAsync(posts.indexToday));

router.route("/:id")
    .get(isLoggedIn, catchAsync(posts.showPost))
    .put(isLoggedIn, isAuthor, validatePost, catchAsync(posts.updatePost))
    .delete(isLoggedIn, isAuthor, catchAsync(posts.deletePost));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(posts.renderEditForm))

module.exports = router;