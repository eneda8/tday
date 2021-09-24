const express = require("express");
const router = express.Router();
const posts = require("../controllers/posts");
const catchAsync = require("../utils/catchAsync");
const Post = require("../models/post");
const {isLoggedIn, isAuthor, validatePost, setPostedToday, blockDuplicatePost, checkPostStreak} = require("../middleware");
const multer = require("multer");
const {storage} = require("../cloudinary");
const upload = multer({storage});

router.route("/")
    // .get(isLoggedIn, setPostedToday, catchAsync(posts.index))
    .post(isLoggedIn, upload.single("image"), validatePost, setPostedToday,  blockDuplicatePost, checkPostStreak, catchAsync(posts.createPost));

router.get("/new", isLoggedIn, setPostedToday, blockDuplicatePost, checkPostStreak, catchAsync(posts.renderNewForm));

router.route("/:id")
    .get(isLoggedIn, setPostedToday, checkPostStreak, catchAsync(posts.showPost))
    .put(isLoggedIn, isAuthor, upload.single("image"), validatePost, catchAsync(posts.updatePost))
    .post(isLoggedIn, upload.single("image"), validatePost, setPostedToday, blockDuplicatePost, catchAsync(posts.createPost))
    .delete(isLoggedIn, isAuthor, catchAsync(posts.deletePost));

router.route("/:id/bookmark")
    .post(isLoggedIn, catchAsync(posts.bookmarkPost))
    .delete(isLoggedIn, catchAsync(posts.unbookmarkPost));  

router
    // .get("/:id/edit", isLoggedIn, isAuthor, setPostedToday, catchAsync(posts.renderEditForm))
    .post("/:id/edit", isLoggedIn, upload.single("image"), validatePost, setPostedToday, blockDuplicatePost, catchAsync(posts.createPost))

module.exports = router;