const express = require("express");
const router = express.Router({mergeParams:true});
const {validateComment, isLoggedIn, isVerified, isCommentAuthor} = require("../middleware")
const Post = require("../models/post");
const Comment = require("../models/comment");
const comments = require("../controllers/comments");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

router.post("/", isLoggedIn, isVerified, validateComment, catchAsync(comments.createComment));

router.put("/:commentId", isLoggedIn, isVerified, isCommentAuthor, catchAsync(comments.editComment));

router.delete("/:commentId", isLoggedIn, isVerified, isCommentAuthor, catchAsync(comments.deleteComment));

module.exports = router;