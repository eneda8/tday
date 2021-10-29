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
    res.render("users/register", {countries, title: "Register / t'day"})
}

module.exports.register = async (req,res, next) => {
    try{
        const {username, displayName, email, password, ageGroup, gender, country, avatar} = req.body;
        const user = new User({username, displayName, email, ageGroup, gender, country, avatar});
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
            req.flash("success", `Welcome to t'day, ${req.user.displayName}!`);
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
    res.render("users/login", {title:"Login / t'day"})
}

module.exports.login = (req,res) => {
    delete req.session.returnTo;
    const redirectUrl = req.session.returnTo || "/home";
    req.flash("success", `Welcome back, ${req.user.displayName}!`);
    res.redirect(redirectUrl);
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
        let today =new Date().toLocaleString('en-us', {weekday:'long'});
        res.render("landing", {today, title: "t'day"});
    }
}

module.exports.renderAbout = (req, res) => {
    res.render("about", {title: "About / t'day"})
}

//------------------------- HOME -------------------------

module.exports.renderHomePage= async (req, res) =>{
    const user = await User.findById(req.user._id).populate("posts");
    const longToday = new Date().toLocaleDateString( 'en-US', {year: 'numeric', month: 'long', day: 'numeric'});
    const today = getToday();
    try{
        //show today's rating, if available
        let todaysPost;
        if(user.postedToday == true && user.todaysPost.length) {
            todaysPost = await Post.findById(user.todaysPost);
        }  else {todaysPost = "null"}
          //show 10 random posts
          const random = async function (num){
            const randomDocs = [];
            const {dbQuery} = res.locals; 
            for(let i =0; i < num; i++) {
                // const count = await Post.countDocuments().where({date: getToday()}).where({body:{$exists: true}});
                const count = await Post.countDocuments().where({date: getToday()}).where({$or: [{body:{$exists: true}}, {image:{$exists: true}}]});
                const rand = Math.floor(Math.random() * count);
                const filter = dbQuery ? dbQuery : {date: getToday()}
                const randomDoc = await Post.findOne(filter).skip(rand);
                // console.log(randomDoc);
                if(randomDoc){
                    randomDocs.push(randomDoc);
                }
            }
            return randomDocs;
        }
        const posts = await random(10);
        for(let post of posts) {
            if(!post === null){
            post.populate("author").execPopulate();
            }
        }
        res.render("users/home", {posts, longToday, today, within24Hours, todaysPost, user, countries, title: "Home / t'day"});
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
    res.render("users/show", {user, comments, within24Hours, getToday, title: `@${user.username} / t'day`});
};

module.exports.updateProfile = async(req, res) => {
    const {displayName, bio, coverColor} = req.body;
    const user = await User.findById(req.user._id).populate("posts");
    await user.update({...req.body});
    const oldAvatar = user.avatar;
    const oldCoverPhoto = user.coverPhoto || ""
    if(req.files){
        if(req.files.avatar){
        user.avatar = req.files.avatar[0];
        cloudinary.uploader.destroy(oldAvatar.filename);
        } if(req.files.coverPhoto){
            user.coverPhoto = req.files.coverPhoto[0];
            if(oldCoverPhoto.length){
                cloudinary.uploader.destroy(oldCoverPhoto.filename)
            }  
        }
    }
    for(let post of user.posts){
        post.authorDisplayName = displayName;
        post.save()
    }
    if(!user){
        req.flash("error", "User not found!")
        return res.redirect("/home");
    }
    await user.save()
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
    res.render("users/settings", {user, countries, title: "Settings / t'day"});
};

module.exports.updateUserInfo = async(req, res) => {
    try{
        const user = await User.findById(req.user._id).populate("posts");
        if(!user) {
            req.flash("error", "Oops, something went wrong! Please try again.")
            return res.redirect("back");
        }
        const {username, email, country} = req.body;
        console.log(country)
        const newFlag = countries.filter(obj => Object.values(obj).includes(country.name))[0]["flag"];
        console.log(newFlag)
        await user.update({...req.body});
        user.country.flag = newFlag;
        for(let post of user.posts){
            post.authorUsername = username;
            post.authorCountry = country.name;
            post.save()
        }
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