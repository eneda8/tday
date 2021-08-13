const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

const countries = require("../countries");

module.exports.renderRegisterForm = (req, res) => {
    if (req.isAuthenticated()) {
        req.flash("error", "You are already logged in!");
        return res.redirect('/posts');
    }
    res.render("users/register", {countries})
}

module.exports.register = async (req,res, next) => {
    try{
        const {email, username, password, birthday, gender, country, avatar} = req.body;
        const user = new User({email, username, birthday, gender, country, avatar});
        if(req.file){
            user.avatar = req.file;
        } else {
            user.avatar = {}
        }
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash("success", `Welcome to todai, ${req.user.username}!`);
            res.redirect("/posts/today");
        })
    } catch(e) {
        req.flash("error", `${e.message}.`, "Please try again!");
        res.redirect("/register")
    }
}

module.exports.renderLoginForm = (req,res) => {
    if (req.isAuthenticated()) {
        req.flash("error", "You are already logged in!");
        return res.redirect('/posts');
    }
    res.render("users/login")
}

module.exports.login = (req,res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo || "/posts";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res) => {
    req.logout();
    req.flash("success", "Goodbye!");
    res.redirect("/posts");
}

module.exports.showUserProfile = async(req, res) => {
    const user = await User.findOne({username : req.params.username})
    .populate("posts").populate("comments"); 
    if(!user){
        req.flash("error", "User not found!")
        return res.redirect("/posts");
    }
    const postCount = await Post.find({"author": user}).countDocuments(function(err, count){
        return count;
    });
    const commentCount = await Comment.find({"author": user}).countDocuments((err, count) => count)

    res.render("users/show", {user, postCount, commentCount});
};

module.exports.showUserSettings = async(req, res) => {
    const user = await User.findOne({username: req.user.username})
    if(!user){
        req.flash("error", "User not found!")
        return res.redirect("/posts");
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
        return res.redirect("/posts");
    }
    user.save()
    req.flash("success", "Preferences updated");
    res.redirect(`/u/${user.username}`) 
};