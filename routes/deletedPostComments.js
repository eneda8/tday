const express = require("express");
const router = express.Router({mergeParams:true});
const {validateComment, isLoggedIn, isCommentAuthor} = require("../middleware")
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
    res.redirect("back");
}

router.delete("/:commentId", isLoggedIn, isCommentAuthor, catchAsync(deleteComment));

module.exports = router;
