const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const Journal = require("../models/journal");
const countries = require("../countries");
const {cloudinary} = require("../cloudinary");
const {within24Hours} = require("../utils/getToday");

module.exports.renderLandingPage = (req, res) => {
    if(req.user){
        return res.redirect("/home");
    } else {
        const today = new Date().toLocaleString('en-us', {weekday:'long'});
        res.render("landing", {today, title: "todai"});
    }
}

module.exports.renderHomePage= async (req, res) =>{
    const user = await User.findById(req.user._id);
    const today = new Date().toLocaleDateString(
        'en-US',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
      )
      let todaysPost;
      if(user.postedToday == true && user.todaysPost.length) {
        todaysPost = await Post.findById(user.todaysPost);
        console.log("todaysPost:", todaysPost);
        console.log("user.todaysPost:", user.todaysPost);
      }  else {ltodaysPost = "null"}
    try{
        const posts = await Post.random(10);
        for(post of posts) {
            await post.populate("author").execPopulate();
        }
        res.render("users/home", {posts, today, within24Hours, todaysPost, title: "Home / todai"});
    } catch(e) {
        console.log(e)
        req.flash("error", `Oops, something went wrong!`)
        res.redirect(`/u/${user.username}`)
    }
}

module.exports.renderRegisterForm = (req, res) => {
    if (req.isAuthenticated()) {
        req.flash("error", "You are already logged in!");
        return res.redirect('/home');
    }
    res.render("users/register", {countries})
}

module.exports.register = async (req,res, next) => {
    try{
        const {username, displayName, email, password, birthyear, gender, country, avatar} = req.body;
        const user = new User({username, displayName, email, birthyear, gender, country, avatar});
        if(req.file){
        user.avatar = req.file;
        } else {
            user.avatar = {}
        }
        user.postedToday = false;
        user.country.flag = countries.filter(obj => Object.values(obj).includes(user.country.name))[0]["flag"];
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err); 
            req.flash("success", `Welcome to todai, ${req.user.username}!`);
            res.redirect(`/u/${username}`);
        })
    } catch(err) {
        req.flash("error", `${err.message}. Please try again!`);
        res.redirect("/register")
    }               
}

module.exports.renderLoginForm = (req,res) => {
    if (req.isAuthenticated()) {
        req.flash("error", "You are already logged in!");
        return res.redirect('/home');
    }
    res.render("users/login")
}

module.exports.login = (req,res) => {
    req.flash("success", `Welcome back, ${req.user.username}!`);
    res.redirect("/home")
}

module.exports.logout = (req,res) => {
    const today = new Date();
    const hour = today.getHours()
    let greeting = (hour <= 17) ? "Signed out, have a good day!" : "Signed out, have a good night!";
    req.logout();
    req.flash("success", `${greeting}`);
    res.redirect("/");
}

module.exports.showUserProfile = async(req, res) => {
    const user = await User.findOne({username : req.params.username})
    .populate("journals").populate("posts").populate("comments").populate({
        path: "bookmarks",
        populate: {path: "author"}
    }); 
    if(!user){
        req.flash("error", "User not found!")
        return res.redirect("/users/home");
    }
    const postCount = await Post.find({"author": user}).countDocuments((count) => count);
    const commentCount = await Comment.find({"author": user}).countDocuments((count) => count)
    const comments = await Comment.find({"author": user}).sort({"createdAt": -1}).populate("author")
    .populate({
        path: "post", 
        populate: {path: "author"}
    });
    res.render("users/show", {user, postCount, commentCount, comments, within24Hours, title: `@${user.username} / todai`});
};

module.exports.showUserSettings = async(req, res) => {
    const user = await User.findOne({username: req.user.username})
    const creationDate = user.createdAt;
    if(!user){
        req.flash("error", "User not found!")
        return res.redirect("/users/home");
    }
    res.render("users/settings", {user, creationDate, title: "Settings / todai"});
};
    
module.exports.updateUserSettings = async(req, res) => {
    const {displayName, bio, coverColor} = req.body;
    const user = await User.findById(req.user._id);
    const oldAvatar = user.avatar;
    await user.update({...req.body});
    if(req.file){
        user.avatar = req.file;
        await cloudinary.uploader.destroy(oldAvatar.filename)
    }
    if(!user){
        req.flash("error", "User not found!")
        return res.redirect("/users/home");
    }
    user.save()
    req.flash("success", "Profile updated!");
    res.redirect(`/u/${user.username}`) 
};

module.exports.deleteAccount = async(req, res) => {
    const user = await User.findById(req.user._id);
    user.posts = [];
    user.comments = [];
    user.journals = [];
    user.bookmarks = [];
    const posts = await Post.remove({"author": req.user._id});
    const comments = await Comment.remove({"author": req.user._id});
    const journals = await Journal.remove({"author": req.user._id});
    await req.logout();
    const deletedUser = await User.remove({"_id": user._id});
    console.log("User account deleted")
    req.flash("success", "User account deleted.");
    res.redirect("/");
}