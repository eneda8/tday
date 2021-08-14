const Post = require("../models/post");
const User = require("../models/user");
const {getToday, getTimestamp} = require("../utils/getToday");
const ObjectID = require('mongodb').ObjectID;
const {cloudinary} = require("../cloudinary");

module.exports.index = async (req, res) => {
    const posts = await Post.find({}).sort({"createdAt": -1});
    for(post of posts) {
        await post.populate("author").execPopulate();
    }
    res.render("posts/index", {posts});
} 

module.exports.indexToday= async (req, res) =>{
    const today = getToday()
    const posts = await Post.random(10);
    for(post of posts) {
        await post.populate("author").execPopulate();
    }
    res.render("posts/today", {posts, today});
}

module.exports.renderNewForm = (req, res) => { 
res.render("posts/new")
}

module.exports.createPost = async (req, res, next) => {
    const post = new Post(req.body.post);
    post.image = req.file;
    post.author = req.user._id;
    const user = await User.findById(req.user._id);
    post.timestamp = getTimestamp();
    user.posts.unshift(post);
    await post.save();
    await user.save();
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
    post.edited = true;
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

