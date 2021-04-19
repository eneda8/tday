const express = require("express");
const router = express.Router();
const {postSchema, userSchema} = require("../schemas.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Post = require("../models/post");
const {isLoggedIn} = require("../middleware");

const validatePost = (req, res, next) => {  
    const {error} = postSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
router.get("/:id", isLoggedIn, catchAsync(async (req,res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        req.flash('error', 'Post not found!');
        return res.redirect('/today');
    }
    res.render("show", {post});
}))

router.get("/:id/edit", isLoggedIn, catchAsync(async (req,res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        req.flash('error', 'Post not found!');
        return res.redirect('/today');
    }
    res.render("edit", {post})
}))

router.put("/:id", isLoggedIn, validatePost, catchAsync(async (req,res) => {
    const {id} = req.params;
    const post = await Post.findByIdAndUpdate(id, {...req.body.post}) ;
    req.flash('success', 'New post updated!');
    res.redirect(`/posts/${post._id}`);
}))

router.delete("/:id", isLoggedIn, catchAsync(async (req,res) => {
    const {id} = req.params;
    await Post.findByIdAndDelete(id);
    req.flash('success', 'New post deleted!')
    res.redirect("/today");
}))

module.exports = router;