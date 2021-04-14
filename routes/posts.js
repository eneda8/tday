const express = require("express");
const router = express.Router();
const {postSchema, userSchema} = require("../schemas.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Post = require("../models/post");

const validatePost = (req, res, next) => {  
    const {error} = postSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
router.get("/:id", catchAsync(async (req,res) => {
    const post = await Post.findById(req.params.id)
    res.render("show", {post})
}))

router.get("/:id/edit", catchAsync(async (req,res) => {
    const post = await Post.findById(req.params.id)
    res.render("edit", {post})
}))

router.put("/:id", validatePost, catchAsync(async (req,res) => {
    const {id} = req.params;
    const post = await Post.findByIdAndUpdate(id, {...req.body.post}) 
    res.redirect(`/posts/${post._id}`)
}))

router.delete("/:id", catchAsync(async (req,res) => {
    const {id} = req.params;
    await Post.findByIdAndDelete(id);
    res.redirect("/today")
}))

module.exports = router;