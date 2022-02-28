const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const Journal = require("../models/journal");
const countries = require("../countries");
const timezones = require("../timezones");
const {cloudinary} = require("../cloudinary");
const {within24Hours} = require("../utils/getToday");
const util = require('util');
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


function validTZ(string){
    return !(/\d/.test(string));
}

// ---------------REGISTER ---------------------------------------
module.exports.renderRegisterForm = (req, res) => {
    if (req.isAuthenticated()) {
        req.flash("error", "You are already logged in!");
        return res.redirect('/home');
    }
    res.render("users/register", {countries, timezones, title: "Register / t'day", style: "users/register"})
}

module.exports.register = async (req,res, next) => {
    try{
        const {username, displayName, email, password, ageGroup, gender, country, timezone, defaultTimezone, termsAgreement} = req.body;
        const user = new User({username, displayName, email, ageGroup, gender, country, defaultTimezone, timezone, avatar, termsAgreement});
        // if(req.file){
        // user.avatar = req.file;
        // } else {
        //     user.avatar = {}
        // }
        if(validTZ(timezone)){
            user.timezone = timezone;
        } else {
            user.timezone = user.defaultTimezone;
        };
        user.postedToday = false;
        user.country.flag = countries.filter(obj => Object.values(obj).includes(user.country.name))[0]["flag"];
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err); 
            res.redirect("/verify");
        })
        const token =  crypto.randomBytes(20).toString("hex");
        user.verifyEmailToken = token;
        user.verifyTokenExpires = Date.now() + 3600000;
        await user.save()
        const msg = {
            to: email,
            from: `t'day <no-reply@tday.co>`,
            subject: `Please verify your email`,
            text: `Welcome to t'day! To complete your account setup, please click here: https://${req.headers.host}/verify/${token}. Or, copy and paste the URL into your browser: https://${req.headers.host}/verify/${token}. - the t'day team `,
            html: `<strong>Welcome to t'day!</strong> <br> <br> To complete your account setup, please click here: <a href="https://${req.headers.host}/verify/${token}">Verify Email</a> <br> <br> Or, copy and paste the URL into your browser: https://${req.headers.host}/verify/${token}. <br> <br><strong>- the t'day team</strong>`,
        }
        await sgMail.send(msg)
    } catch(err) {
        req.flash("error", `${err.message}. Please try again!`);
        res.redirect("/register")
    }               
}

module.exports.renderVerify = (req, res) => {
     res.render("users/verify", {title: "Verify Email / t'day", style: "styles"})
}

module.exports.putVerify = async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if((!user) || user.isVerified === true){
        req.flash("error", "The email you provided is not associated with an account or has already been verified.")
        return res.redirect("/verify")
    } else {
    const token = crypto.randomBytes(20).toString("hex");
    user.verifyEmailToken = token;
    user.verifyTokenExpires = Date.now() + 3600000; 
    await user.save();
    const msg = {
        to: email,
        from: `t'day <no-reply@tday.co>`,
        subject: `Please verify your email`,
        text: `Hello! Welcome to t'day! To complete your account setup. Please click here: https://${req.headers.host}/verify/${token}. Or, copy and paste the URL into your browser: https://${req.headers.host}/verify/${token}. - the t'day team `,
        html: `<strong>Hello!</strong> <br> <br> Welcome to t'day! To complete your account setup, please click here: <a href="https://${req.headers.host}/verify/${token}">Verify Email</a> <br> Or, copy and paste the URL into your browser: https://${req.headers.host}/verify/${token}. <br> <br><strong>- the t'day team</strong>`,
        }
    await sgMail.send(msg)
    res.redirect("/verify");
    }
}

module.exports.putVerified = async(req, res) => {
    const {token} = req.params;
    const user = await User.findOne({verifyEmailToken: token, verifyTokenExpires: {$gt: Date.now()}})
    if(!user){
        req.flash("error", "Email verification token is invalid or has expired.")
        return res.redirect("/verify")
    } else {
    user.verifyEmailToken = null;
    user.verifyTokenExpires = null;
    user.isVerified = true;
    await user.save()
    const login = util.promisify(req.login.bind(req))
    await login(user)
    req.flash("success", `Email address successfully verified. Welcome to t'day, ${user.displayName}!`);
    res.redirect("/home");
    }
}
// -----------------------------LOGIN---------------------------------
module.exports.renderLoginForm = (req,res) => {
    if (req.isAuthenticated()) {
        req.flash("error", "You are already logged in!");
        return res.redirect('/home');
    }
    res.render("users/login", {title:"Login / t'day", style: "users/login"})
}

module.exports.login = async (req,res) => {
    const user = await User.findById(req.user._id);
    if(validTZ(req.body.timezone)){
        user.timezone = req.body.timezone;
        res.locals.timezone = req.body.timezone;
    } else {
        user.timezone = user.defaultTimezone;
        res.locals.timezone = user.defaultTimezone;
    }
    await user.save()
    delete req.session.returnTo;
    const redirectUrl = req.session.returnTo || "/home";
    req.flash("success", `Welcome back, ${req.user.displayName}!`);
    if(req.user.isVerified === false){
        res.redirect("/verify")
    } else {
        res.redirect(redirectUrl)
    }
}


// -----------------------FORGOT PASSWORD------------------

module.exports.getForgotPw = (req, res) => {
    res.render("users/forgot", {title: "Forgot Password / t'day"})
}

module.exports.putForgotPw = async (req, res) => {
    const token = crypto.randomBytes(20).toString("hex");
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        req.flash("error", "No account with that email.")
        return res.redirect("/forgot-password")
    }
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();
    const msg = {
    to: email,
    from: `t'day <no-reply@tday.co>`,
    subject: `Reset Password Link`,
    text: `Hi ${user.displayName}, Forgot your password? We received a request to reset the password for your account. To reset your password, click this link: https://${req.headers.host}/reset/${token}. Or, copy and paste the URL into your browser: https://${req.headers.host}/reset/${token}. If you didn't request a password reset, you can ignore this email - your password won't be changed. -the t'day team `,
    html: `Hi ${user.displayName}, <br> <br> Forgot your password? We received a request to reset the password for your account. <br> <br> To reset your password, click this link: <a href="https://${req.headers.host}/reset/${token}">Reset Password</a> <br> Or, copy and paste the URL into your browser: https://${req.headers.host}/reset/${token} <br> <br> If you didn't request a password reset, you can ignore this email. Your password won't be changed. <br> <br> <strong>-the t'day team</strong>`,
    }
    await sgMail.send(msg)
    req.flash("success", `An email has been sent to ${email} with further instructions.`);
    res.redirect("/forgot-password");
}

module.exports.getReset= async (req, res) => {
    const {token} = req.params;
    const user = await User.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}});
    if(!user){
        req.flash("error", "Password reset token is invalid or has expired.")
        return res.redirect("/forgot-password")
    }
    res.render("users/reset", {token, title: `Reset Password / t'day`, style: "styles"})
}

module.exports.putReset = async (req, res) => {
    const {token} = req.params;
    const user = await User.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}});
    if(!user){
        req.flash("error", "Password reset token is invalid or has expired.")
        return res.redirect("/forgot-password")
    }
    if(req.body.password === req.body.confirm){
        await user.setPassword(req.body.password);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
        const login = util.promisify(req.login.bind(req));
        await login(user);
    } else {
        req.flash("error", "Passwords do not match.");
        return res.redirect(`/reset/${token}`)
    }
    const msg = {
        to: user.email,
        from: `t'day  <support@tday.co>`,
        subject: `Your password was changed`,
        text: `Hi ${user.displayName}, We're sending you this email to confirm that your password has been changed. If you did not make this change, please reply and notify us at once.  -the t'day team`,
        html: `Hi ${user.displayName}, <br> <br> We're sending you this email to confirm that your password has been changed. If you did not make this change, please reply and notify us at once. <br> <br> <strong>-the t'day team</strong>`,
    }
    await sgMail.send(msg);
    req.flash("success", "Password successfully updated!");
    res.redirect("/home");
}
// -------------------------------LOGOUT-----------------------------
module.exports.logout = (req,res) => {
    req.logout();
    req.flash("success", "Signed out, have a good day!");
    res.redirect("/");
}
//------------------------- HOME -------------------------

module.exports.renderHomePage= async (req, res) =>{
    // console.log(res.locals.cookie['timezone'])
    try{
        const user = await User.findById(req.user._id).populate("posts");
        const today = res.locals.cookie['today'];
        //show today's rating, if available
        let todaysPost;
        if(user.postedToday == true && user.todaysPost.length) {
            todaysPost = await Post.findById(user.todaysPost);
        }  else {todaysPost = "null"}
          //show 10 random posts
        let count = await Post.countDocuments().where({date: today}).where({$or: [{body:{$exists: true}}, {image:{$exists: true}}]});
        let posts;
        if (count <= 10){
            posts = await Post.find({date: today}).where({$or: [{body:{$exists: true}}, {image:{$exists: true}}]});
        } else {
            const random = async function (num){
                const randomDocs = [];
                const {dbQuery} = res.locals; 
                for(let i =0; i < num; i++) {
                    const rand = Math.floor(Math.random() * count);
                    const filter = dbQuery ? dbQuery : {date: today}
                    const randomDoc = await Post.findOne(filter).skip(rand);
                    if(randomDoc){
                        randomDocs.push(randomDoc);
                    }
                }
                return randomDocs;
            }
            posts = await random(10);
        }
        for(let post of posts) {
            if(!post === null){
            post.populate("author");
            }
        }
        res.render("users/home", {posts, today, within24Hours, todaysPost, user, countries, title: "Home / t'day", style: "styles"});
    } catch(e) {
        console.log(e)
        req.flash("error", `Oops, something went wrong!`)
        res.redirect(`/u/${user.username}`)
    }
}

// ------------------------USER PROFILE-----------------------------
module.exports.showUserProfile = async(req, res) => {
    const today = res.locals.cookie['today'];
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
    res.render("users/show", {user, comments, today, within24Hours, title: `@${user.username} / t'day`, style: "styles"});
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
    res.render("users/settings", {user, countries, title: "Settings / t'day", style: "styles"});
};

module.exports.updateUserInfo = async(req, res) => {
    try{
        const user = await User.findById(req.user._id).populate("posts");
        if(!user) {
            req.flash("error", "Oops, something went wrong! Please try again.")
            return res.redirect(`/home`);
        }
        const oldEmail = user.email;
        const {username, email, country} = req.body;
        if(username.length && !(username === user.username)){
            user.username= username;
            for(let post of user.posts){
                post.authorUsername = username;
                post.save()
            }
            const msg = {
                to: [{email: email}, {email: oldEmail}],
                from: `t'day  <support@tday.co>`,
                subject: `Your username was changed`,
                text: `Hi ${user.displayName}, We're sending you this email to confirm that the username for your account has been changed to ${username}. You have been signed out and will need to use your new username to log back in: https://www.tday.com/login If you did not make this change, please reply and notify us at once. -the t'day team`,
                html: `Hi ${user.displayName}, <br> <br> We're sending you this email to confirm that the username for your account has been changed to <strong>${username}</strong>. You have been signed and will need to use your new username to log back in : <a href="https://www.tday.com/login">Login</a> <br> <br> If you did not make this change, please reply and notify us at once. <br> <br> <strong>-the t'day team</strong>`,
            }
            await sgMail.send(msg);
        }
        if(email.length && !(email === user.email)){
            user.email = email;
            const msg = {
                to: [{email: email}, {email: oldEmail}],
                from: `t'day  <support@tday.co>`,
                subject: `Your email was changed`,
                text: `Hi ${user.displayName}, We're sending you this email to confirm that the email for your account has been changed from ${oldEmail} to ${email}. If you did not make this change, please reply and notify us at once.  -the t'day team`,
                html: `Hi ${user.displayName}, <br> <br> We're sending you this email to confirm that the email for your account has been changed from ${oldEmail} to ${email}. If you did not make this change, please reply and notify us at once. <br> <br> <strong>-the t'day team</strong>`,
            }
            await sgMail.send(msg);
        }
        if(!(country.name === user.country.name)){
            user.country.name = country.name;
            const newFlag = countries.filter(obj => Object.values(obj).includes(country.name))[0]["flag"];
            user.country.flag = newFlag;
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
    const {oldPassword, newPassword, confirmPassword} = req.body;
    const user = await User.findById(req.user._id);
    try{
        if(!newPassword === confirmPassword){
            req.flash("error", "Passwords do not match. Please try again.");
            return res.redirect("/settings#change-password")
        } else {
        await user.changePassword(oldPassword, newPassword);
        user.save();
        console.log("password updated");
        const msg = {
            to: user.email,
            from: `t'day <support@tday.co>`,
            subject: `Your password was changed`,
            text: `Hi ${user.displayName}, We're sending you this email to confirm that your password has been changed. If you did not make this change, please reply and notify us at once.  -the t'day team`,
            html: `Hi ${user.displayName}, <br> <br> We're sending you this email to confirm that your password has been changed. If you did not make this change, please reply and notify us at once. <br> <br> <strong>-the t'day team</strong>`,
        }
        await sgMail.send(msg);
        req.flash("success", "Password successfully updated!");
        res.redirect("/home")
        }
    } catch(err) {
        console.log(err);
        req.flash("error", "Current password is incorrect. Please try again.")
        res.redirect("/settings#change-password")
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
        await Post.remove({"author": req.user._id});
        await Comment.remove({"author": req.user._id});
        await Journal.remove({"author": req.user._id});
        await req.logout();
        const msg = {
            to: user.email,
            from: `t'day <support@tday.co>`,
            subject: `Your account was deleted`,
            text: `Hi, We're sending you this email to confirm that your account with t'day has been deleted. We hate to see you go and hope you'll be back with us soon!  -the t'day team`,
            html: `Hi, <br> <br> We're sending you this email to confirm that your account with t'day has been deleted. We hate to see you go and hope you'll be back with us soon! <br> <br> <strong>-the t'day team</strong>`,
        }
        await sgMail.send(msg);
        await User.remove({"_id": user._id});
        console.log("User account deleted")
        req.flash("success", "Account successfully deleted.");
        res.redirect("/");
    } catch (e){
        console.log(e);
        req.flash("error", "Password is incorrect.");
        return res.redirect("/settings")
    }
}