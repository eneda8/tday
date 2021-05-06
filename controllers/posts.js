const Post = require("../models/post");
const User = require("../models/user");
const {getToday} = require("../utils/getToday");
const ObjectID = require('mongodb').ObjectID;
const {cloudinary} = require("../cloudinary");

module.exports.index = async (req, res) => {
    const posts = await Post.find({})
    for(post of posts) {
        await post.populate("author").populate({
            path: "image",
            populate:{path: "path"}
        }).execPopulate();
    }
    // posts.sort({date:-1});
    res.render("posts/index", {posts});
} 

module.exports.indexToday= async (req, res) =>{
    const today = getToday();
    const posts = await Post.find({date: today});
    for(post of posts) {
        await post.populate("author").populate({
            path: "image",
            populate:{path: "path"}
        }).execPopulate();
    }
    // posts.sort({date:-1});
    res.render("posts/today", {posts});
}

module.exports.renderNewForm = (req, res) => { 
res.render("posts/new")
}

module.exports.createPost = async (req, res, next) => {
    const post = new Post(req.body.post);
    post.image = req.file;
    post.author = req.user._id;
    const user = await User.findById(req.user._id);
    user.posts.push(post);
    await post.save();
    await user.save();
    console.log(`Post created: ${post}`)
    req.flash("success", "New post submitted!");
    res.redirect(`/posts/${post._id}`)
}

module.exports.showPost = async (req,res) => { 
    const {id} = req.params;
    if (!ObjectID.isValid(id)) {
        req.flash("error", "Post not found!")
        return res.redirect("/posts");
    }
    const post = await Post.findById(id);
    await post.populate("author").populate({
        path: "comments",
        populate:{path: "author"}
    }).execPopulate();

    if(!post){
        req.flash("error", "Post not found!")
        return res.redirect("/posts");
    }
    res.render("posts/show", {post})
}

module.exports.renderEditForm = async (req,res) => {
    const post = await Post.findById(req.params.id);
    if(!post){
        req.flash("error", "Post not found!")
        return res.redirect("/posts");
    }
    res.render("posts/edit", {post})
}

module.exports.updatePost = async (req,res) => {
    const {id} = req.params;
    const post = await Post.findByIdAndUpdate(id, {...req.body.post} ) 
    if(req.file) {
        post.image = req.file;
    }
    if(req.body.deleteImage){
        await cloudinary.uploader.destroy(req.body.deleteImage[0])
        await post.updateOne({$set: {image: null}});
    } 
    await post.save();
    req.flash("success", "Post updated!");
    res.redirect(`/posts/${post._id}`)
}

module.exports.deletePost = async (req,res) => {
    const {id} = req.params;
    await Post.findByIdAndDelete(id);
    req.flash("success", "Post deleted!")
    res.redirect("/posts")
}

