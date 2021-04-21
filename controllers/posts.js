const Post = require("../models/post");
const User = require("../models/user");
const {getToday} = require("../utils/getToday");

module.exports.index = async (req, res) => {
    const posts = await Post.find({}).populate("author");
        // populate not working
    res.render("posts/index", {posts});
} 

module.exports.indexToday= async (req, res) =>{
        const today = getToday();
        const posts = await Post.find({date: today}).populate("author").sort({date:-1});
            // populate not working
        res.render("posts/today", {posts});
}

module.exports.renderNewForm = (req, res) => { 
res.render("posts/new")
}

module.exports.createPost = async (req, res, next) => {
    const post = new Post(req.body.post);
    post.author = req.user._id;
    const user = await User.findById(req.user._id);
    user.posts.push(post);
    await post.save();
    await user.save();
    req.flash("success", "New post submitted!");
    res.redirect(`/posts/${post._id}`)
}

module.exports.showPost = async (req,res) => { 
    const post = await Post.findById(req.params.id).populate("author").populate("comments");
        // populate not working
    if(!post){
        req.flash("error", "Post not found!")
        return res.redirect("/posts");
    }
    res.render("posts/show", {post})
}

module.exports.renderEditForm = async (req,res) => {
    const post = await Post.findById(req.params.id) //populate author?
    if(!post){
        req.flash("error", "Post not found!")
        return res.redirect("/posts");
    }
    res.render("posts/edit", {post})
}

module.exports.updatePost = async (req,res) => {
    const {id} = req.params;
    const post = await Post.findByIdAndUpdate(id, {...req.body.post} ) 
    req.flash("success", "Post updated!");
    res.redirect(`/posts/${post._id}`)
}

module.exports.deletePost = async (req,res) => {
    const {id} = req.params;
    await Post.findByIdAndDelete(id);
    req.flash("success", "Post deleted!")
    res.redirect("/posts")
}

