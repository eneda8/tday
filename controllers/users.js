const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const countries = require("../countries");

module.exports.renderRegisterForm = (req, res) => {
    if (req.isAuthenticated()) {
        req.flash("error", "You are already logged in!");
        return res.redirect('/posts/today');
    }
    res.render("users/register", {countries})
}

module.exports.register = async (req,res, next) => {
    const {email, username, password, birthday, gender, country, avatar, displayName} = req.body;
    const user = new User({email, username, birthday, gender, country, avatar, displayName});
    if(req.file){
        user.avatar = req.file;
    } else {
        user.avatar = {}
    }
    user.postedToday = false;
    user.country.flag = countries.filter(obj => Object.values(obj).includes(user.country.name))[0]["flag"];
    const registeredUser = await User.register(user, password);
    await req.login(registeredUser, err => {
        if(err) {
            req.flash("error", `${err.message}. Please try again!`);
            res.redirect("/register")
        }
        else {
            req.flash("success", `Welcome to todai, ${req.user.username}!`);
            res.redirect(`/u/${username}`);
        }
    })

}

module.exports.renderLoginForm = (req,res) => {
    if (req.isAuthenticated()) {
        req.flash("error", "You are already logged in!");
        return res.redirect('/posts/today');
    }
    res.render("users/login")
}

module.exports.login = (req,res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo || "/posts/today";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res) => {
    req.logout();
    req.flash("success", "Goodbye!");
    res.redirect("/");
}

module.exports.showUserProfile = async(req, res) => {
    const user = await User.findOne({username : req.params.username})
    .populate("journals").populate("posts").populate("comments"); 
    if(!user){
        req.flash("error", "User not found!")
        return res.redirect("/posts/today");
    }
    const postCount = await Post.find({"author": user}).countDocuments((count) => count);
    const commentCount = await Comment.find({"author": user}).countDocuments((count) => count)
    const comments = await Comment.find({"author": user}).sort({"createdAt": -1}).populate("author");
    res.render("users/show", {user, postCount, commentCount, comments});
};

module.exports.showUserSettings = async(req, res) => {
    const user = await User.findOne({username: req.user.username})
    if(!user){
        req.flash("error", "User not found!")
        return res.redirect("/posts/today");
    }
    res.render("users/settings", {user});
};
    
module.exports.updateUserSettings = async(req, res) => {
    const {displayName, bio, coverColor} = req.body;
    const user = await User.findOneAndUpdate({username: req.user.username}, {...req.body})
    if(req.file){
        user.avatar = req.file;
    }
    if(!user){
        req.flash("error", "User not found!")
        return res.redirect("/posts/today");
    }
    user.save()
    req.flash("success", "Profile updated!");
    res.redirect(`/u/${user.username}`) 
};