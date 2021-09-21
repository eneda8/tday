const Post = require("../models/post");
const User = require("../models/user");
const {getToday, getTimestamp, within24Hours} = require("../utils/getToday");
const ObjectID = require('mongodb').ObjectID;
const {cloudinary} = require("../cloudinary");

// module.exports.index = async (req, res) => {
//     const posts = await Post.find({}).sort({"createdAt": -1});
//     for(post of posts) {
//         await post.populate("author").execPopulate();
//     }
//     res.render("posts/index", {posts});
// } 

module.exports.renderNewForm = (req, res) => { 
    res.render("posts/new")
}

module.exports.createPost = async (req, res, next) => {
    const post = new Post(req.body.post);
    post.date = getToday();
    post.timestamp = getTimestamp();
    post.image = req.file;
    post.author = req.user._id;
    const user = await User.findById(req.user._id);
    user.posts.unshift(post);
    user.postedToday = true;
    user.postStreak ++; 
    await post.save();
    user.todaysPost = post._id; 
    await user.save();
    req.flash("success", "New rating submitted!");
    res.redirect(`/posts/${post._id}`)
}

module.exports.showPost = async (req,res) => { 
    const user = await User.findById(req.user._id);
    const {id} = req.params;
    if (!ObjectID.isValid(id)) {
        req.flash("error", "Rating not found!")
        return res.redirect("/home");
    }
    const post = await Post.findById(id);
    await post.populate("author").populate({
        path: "comments",
        populate:{path: "author"}
    }).execPopulate();
    const canEdit = within24Hours(post);
    if(!post){
        req.flash("error", "Rating not found!")
        return res.redirect("/home");
    }
    res.render("posts/show", {user, post, canEdit, title: `@${user.username}'s day / todai `})
}

module.exports.bookmarkPost = async(req, res) => {
    try{
        const {id} = req.params;
        const post = await Post.findById(id);
        const user = await User.findById(req.user._id);
        user.bookmarks.unshift(post);
        user.save()
        req.flash("success", "Bookmark added!");
        res.redirect(`/u/${user.username}#nav-bookmarks`)
    } catch (e){
        console.log(e)
        req.flash("error", "Oops something went wrong!");
        res.redirect(`/posts/${post._id}`)
    }   
}

module.exports.unbookmarkPost = async(req, res) => {
    try{
        const {id} = req.params;
        const post = await Post.findById(id);
        const user = await User.findById(req.user._id);
        user.bookmarks.pull(id);
        user.save()
        req.flash("success", "Bookmark removed!");
        res.redirect("back")
    } catch (e){
        console.log(e)
        req.flash("error", "Oops something went wrong!");
        res.redirect("back")
    }   
}

// module.exports.copy = async(req, res) => {
//     req.flash("success", "Link copied!");
//     res.redirect("back");
// }

module.exports.renderEditForm = async (req,res) => {
    const post = await Post.findById(req.params.id);
    if(!post){
        req.flash("error", "Rating not found!")
        return res.redirect("/home");
    }
    res.render("posts/edit", {post, title: "Edit rating / todai"})
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
    req.flash("success", "Rating updated!");
    res.redirect(`/posts/${post._id}`)
}

module.exports.deletePost = async(req, res) => {
    const {id} = req.params;
    const user = await User.findById(req.user._id).populate("posts");
    const today = getToday();
    const post = await Post.findById(id).populate("author");
    if(post.date === today){
        user.posts.shift();
        user.postedToday = false;
        user.todaysPost = ""
        user.postStreak --;
        user.save();
    } else {
        user.posts.pull(id)
        user.save()
    }
    if(post.image) await cloudinary.uploader.destroy(post.image.filename);
    await post.remove();
    req.flash("success", "Rating deleted");
    res.redirect(`/u/${user.username}`);
}
