const express = require("express");
const router = express.Router({mergeParams:true});
const {validateComment, isLoggedIn, isVerified, isCommentAuthor} = require("../middleware")
const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const deleteComment = async (req,res) =>{
    const {commentId} = req.params;
    await User.findByIdAndUpdate(req.user._id, {$pull: {comments: commentId}});
    await Comment.findByIdAndDelete(commentId); 
    req.flash("success", "Successfully deleted comment");
    res.redirect("/home");
}

router.delete("/:commentId", isLoggedIn, isVerified, isCommentAuthor, catchAsync(deleteComment));

module.exports = router;
