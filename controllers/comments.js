const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

module.exports.createComment = async (req, res) => {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user._id);
    const comment = new Comment(req.body.comment);
    comment.author = user;
    comment.post = post;
    post.comments.push(comment);
    user.comments.unshift(comment);
    await comment.save();
    await post.save();
    await user.save();
    req.flash("success", "New comment submitted")
    res.redirect(`/posts/${post._id}`);
}

module.exports.editComment = async (req,res) =>{
    const {id, commentId} = req.params;
    await Post.findByIdAndUpdate(id)
    await Comment.findByIdAndUpdate(req.params.commentId); 
    req.flash("success", "Successfully updated comment");
    res.redirect("back");
}

module.exports.deleteComment = async (req,res) =>{
    const {id, commentId} = req.params;
    await Post.findByIdAndUpdate(id, {$pull: {comments: commentId}});
    await User.findByIdAndUpdate(req.user._id, {$pull: {comments: commentId}});
    await Comment.findByIdAndDelete(req.params.commentId); 
    req.flash("success", "Successfully deleted comment");
    res.redirect("back");
}
