const express = require("express");
const router = express.Router();
const posts = require("../controllers/posts");
const catchAsync = require("../utils/catchAsync");
const Post = require("../models/post");
const {isLoggedIn, isVerified, isAuthor, validatePost, correctCookies, setPostedToday, blockDuplicatePost, resetPostStreak, searchAndFilterPosts} = require("../middleware");
const multer = require("multer");
const {storage} = require("../cloudinary");
const upload = multer({storage});

router.route("/")
    // .get(isLoggedIn, setPostedToday, catchAsync(searchAndFilterPosts), catchAsync(posts.index))
    .post(isLoggedIn, isVerified, upload.single("image"), validatePost, correctCookies, setPostedToday,  blockDuplicatePost, resetPostStreak, catchAsync(posts.createPost));

router.route("/search")
    .get(isLoggedIn, isVerified, correctCookies, setPostedToday, catchAsync(searchAndFilterPosts), catchAsync(posts.search))

router.get("/new", isLoggedIn, isVerified, correctCookies, setPostedToday, blockDuplicatePost, resetPostStreak, catchAsync(posts.renderNewForm));

router.route("/:id")
    .get(isLoggedIn, isVerified, correctCookies, setPostedToday, resetPostStreak, catchAsync(posts.showPost))
    .put(isLoggedIn, isVerified, isAuthor, upload.single("image"), correctCookies, validatePost, catchAsync(posts.updatePost))
    .post(isLoggedIn, isVerified, upload.single("image"), validatePost, correctCookies, setPostedToday, blockDuplicatePost, catchAsync(posts.createPost))
    .delete(isLoggedIn, isVerified, isAuthor, correctCookies, catchAsync(posts.deletePost));

router.route("/:id/bookmark")
    .post(isLoggedIn, isVerified, catchAsync(posts.bookmarkPost))
    .delete(isLoggedIn, isVerified, catchAsync(posts.unbookmarkPost));  

router
    // .get("/:id/edit", isLoggedIn, isAuthor, setPostedToday, catchAsync(posts.renderEditForm))
    .post("/:id/edit", isLoggedIn, isVerified, upload.single("image"), validatePost, correctCookies, setPostedToday, blockDuplicatePost, catchAsync(posts.createPost))

module.exports = router;