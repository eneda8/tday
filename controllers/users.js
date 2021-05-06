const User = require("../models/user");
const Post = require("../models/post");
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
    const user = await User.findOne({username : req.params.username}).populate("posts").populate("comments"); 
    if(!user){
        req.flash("error", "User not found!")
        return res.redirect("/posts");
    }
    const posts = Post.find().where("author.username").equals(user.username);
    if(!posts){
        req.flash("error", "Something went wrong!")
        return res.redirect("/posts");
    }
    res.render("users/show", {user, posts});
};

  