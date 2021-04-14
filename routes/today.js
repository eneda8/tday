const express = require("express");
const router = express.Router();
const {postSchema, userSchema} = require("../schemas.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Post = require("../models/post");

const getToday = function() {
    const date = new Date() 
    const today = (date.getMonth() +1).toString()+ '/' + date.getDate().toString()+ "/" + date.getFullYear().toString().slice(2)  
    return today;
  }
  
const validatePost = (req, res, next) => {  
    const {error} = postSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
const validateUser = (req, res, next) => {  
    const {error} = userSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.get("/", (req,res) => {
    res.render("home")
})

router.get("/index", catchAsync(async (req, res) => {
    const posts = await Post.find({}).sort({date:-1});
    res.render("index", {posts})
}))

router.get("/today", catchAsync(async (req, res) =>{
    const today = getToday();
    const posts = await Post.find({date: today}).sort({date:-1});
    res.render("today", {posts})
}))

router.post("/", validatePost, catchAsync(async (req,res) => {
    const post = new Post(req.body.post)
    await post.save()
    res.redirect(`/posts/${post._id}`)
}))

module.exports = router;