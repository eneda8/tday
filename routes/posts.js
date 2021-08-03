const express = require("express");
const router = express.Router();
const posts = require("../controllers/posts");
const catchAsync = require("../utils/catchAsync");
const Post = require("../models/post");
const {isLoggedIn, isAuthor, validatePost} = require("../middleware");
const multer = require("multer");
const {storage} = require("../cloudinary");
const upload = multer({storage});

router.route("/")
    .get(isLoggedIn, catchAsync(posts.index))
    .post(isLoggedIn, upload.single("image"), validatePost, catchAsync(posts.createPost));

// router.get("/new", isLoggedIn, posts.renderNewForm);

router.get("/today", isLoggedIn, catchAsync(posts.indexToday))
    .post(isLoggedIn, upload.single("image"), validatePost, catchAsync(posts.createPost));

router.route("/:id")
    .get(isLoggedIn, catchAsync(posts.showPost))
    .put(isLoggedIn, isAuthor, upload.single("image"), validatePost, catchAsync(posts.updatePost))
    .post(isLoggedIn, upload.single("image"), validatePost, catchAsync(posts.createPost))
    .delete(isLoggedIn, isAuthor, catchAsync(posts.deletePost));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(posts.renderEditForm))
    .post(isLoggedIn, upload.single("image"), validatePost, catchAsync(posts.createPost))

module.exports = router;