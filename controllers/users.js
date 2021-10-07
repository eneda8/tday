const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const Journal = require("../models/journal");
const countries = require("../countries");
const {cloudinary} = require("../cloudinary");
const {within24Hours, getToday} = require("../utils/getToday");

// ----------------REGISTER ---------------------------------------
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
            req.flash("success", `Welcome to todei, ${req.user.username}!`);
            res.redirect(`/u/${username}`);
        })
    } catch(err) {
        req.flash("error", `${err.message}. Please try again!`);
        res.redirect("/register")
    }               
}

// -----------------------------LOGIN---------------------------------
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

//------------------------- LANDING -------------------------
module.exports.renderLandingPage = (req, res) => {
    if(req.user){
        return res.redirect("/home");
    } else {
        const today = new Date().toLocaleString('en-us', {weekday:'long'});
        res.render("landing", {today, title: "todei"});
    }
}

//------------------------- HOME -------------------------

module.exports.renderHomePage= async (req, res) =>{
    const user = await User.findById(req.user._id).populate("posts");
    const today = new Date().toLocaleDateString( 'en-US', {year: 'numeric', month: 'long', day: 'numeric'});
            //global average rating
            const todayAvg = new Date().toLocaleDateString(
                'en-US',
                {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }
              );
        
        let average;
        Post.aggregate([
            {$match: {"date": todayAvg}},
            {$group: {_id: null, avgRating: {$avg: "$rating"}}}
        ]).then(function(res) {
            if(res[0]){
            average = res[0].avgRating.toFixed(2)
            } else average = 0
        })
    try{
        //show today's rating, if available
        let todaysPost;
        if(user.postedToday == true && user.todaysPost.length) {
            todaysPost = await Post.findById(user.todaysPost);
        }  else {todaysPost = "null"}
          //show 10 random posts
        const posts = await Post.random(10);
        for(post of posts) {
            if(!post === null){
            post.populate("author").execPopulate();
            }
        }
        res.render("users/home", {posts, today, within24Hours, todaysPost, user, average, title: "Home / todei"});
    } catch(e) {
        console.log(e)
        req.flash("error", `Oops, something went wrong!`)
        res.redirect(`/u/${user.username}`)
    }
}


// ------------------------USER PROFILE-----------------------------
module.exports.showUserProfile = async(req, res) => {
    const user = await User.findOne({username : req.params.username})
        .populate("journals").populate("posts").populate("comments").populate({
            path: "bookmarks",
            populate: {path: "author"}
        }); 
    if(!user){
        req.flash("error", "User not found!")
        return res.redirect("/home");
    }
    const comments = await Comment.find({"author": user}).sort({"createdAt": -1}).populate("post")
    res.render("users/show", {user, comments, within24Hours, getToday, title: `@${user.username} / todei`});
};

module.exports.updateProfile = async(req, res) => {
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
        return res.redirect("/home");
    }
    user.save()
    req.flash("success", "Profile updated!");
    res.redirect(`/u/${user.username}`) 
};


// ----------------------------USER SETTINGS--------------------------------------
module.exports.showUserSettings = async(req, res) => {
    const user = await User.findById(req.user._id);
    if(!user){
        console.log("user not found")
        req.flash("error", "Oops, something went wrong!")
        return res.redirect("/home");
    }
    res.render("users/settings", {user, countries, title: "Settings / todei"});
};

module.exports.updateUserInfo = async(req, res) => {
    try{
        const user = await User.findById(req.user._id);
        if(!user) {
            req.flash("error", "Oops, something went wrong! Please try again.")
            return res.redirect("back");
        }
        const {username, email, country, birthyear, gender} = req.body;
        const newFlag = countries.filter(obj => Object.values(obj).includes(country.name))[0]["flag"];
        await user.update({...req.body});
        user.country.flag = newFlag;
        await user.save();
        req.flash("success", "Account updated!");
        res.redirect(`/u/${user.username}`)
    } catch(e){
        console.log(e);
        req.flash("error", "Oops something went wrong!");
        res.redirect("/settings")
    }

}

module.exports.changePassword = async(req, res) => {
    const {oldPassword, newPassword} = req.body;
    const user = await User.findById(req.user._id);
    try{
        await user.changePassword(oldPassword, newPassword);
        user.save();
        console.log("password updated");
        req.flash("success", "Password Changed Successfully");
        res.redirect("back")
    } catch(err) {
        console.log(err);
        req.flash("error", "Password is incorrect. Please try again.")
        res.redirect("back")
    }
}

module.exports.deleteAccount = async(req, res) => {
    const user = await User.findById(req.user._id);
    const {password} = req.body;
    try{
        await user.authenticate(password);
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
    } catch (e){
        console.log(e);
        req.flash("error", "Password is incorrect.");
        return res.redirect("back")
    }
}