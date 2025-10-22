const ExpressError = require("./utils/ExpressError");
const {postSchema, userSchema, commentSchema} = require("./schemas.js");
const Post = require("./models/post");
const Comment = require("./models/comment");
const User = require("./models/user");
const Journal = require("./models/journal");

//Helper functions
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); //Escape special characters in a string
}

// Function to correct the format of a date string
function correctDate(date){ 
    if( date !== undefined && date.lastIndexOf(" ") == 3){
        let spaceIdx = date.length - 4;
        return date.slice(0, spaceIdx) + " " + date.slice(spaceIdx);
    } else 
    return date;
}

//Function to correct the format of cookie values
module.exports.correctCookies = async (req, res, next) => {
    try{
        let today = res.locals.cookie['today'];
        let yesterday = res.locals.cookie['yesterday'];
        res.locals.cookie['today'] = correctDate(today);
        res.locals.cookie['yesterday'] = correctDate(yesterday);
    } catch(e){
        console.log(e);
    }
    next();
}

//Joi validation functions
module.exports.validatePost = (req, res, next) => {  
    const {error} = postSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateComment = (req, res, next) => {
    const {error} = commentSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//Authentication/verification middleware functions

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash("error", "You must be signed in to do that!");
        return res.redirect("/login");
    }
    next();
}

module.exports.isVerified = (req, res, next) => {
    if(!req.user.isVerified){
        req.flash("error", "Please verify your email to continue.");
        return res.redirect("/verify");
    }
    next();
}

module.exports.alreadyVerified = (req, res, next) => {
    if(req.user.isVerified){
        req.flash("error", "Your account is already verified!");
        return res.redirect("/home");
    }
    next();
}

module.exports.isAccountOwner = async(req, res, next) => {
    const {username} = req.params; 
    const user = await User.find({"username": username});
    if (!user._id == req.user._id) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect("/home");
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    try{
        const post = await Post.findById(id);
        if (!post.author.equals(req.user._id)) {
            req.flash("error", "You do not have permission to do that!");
            return res.redirect(`/posts/${id}`);
        }
    } catch (e){
        console.log(e)
        req.flash("error", "Oops something went wrong! Please try again.");
        return res.redirect("/home");
    }
    next();
}

module.exports.isCommentAuthor = async(req, res, next) => {
    const {id, commentId} = req.params; 
    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/posts/${id}`);
    }
    next();
}

module.exports.isJournalAuthor = async(req, res, next) => {
    const {id, journalId} = req.params; 
    const journal = await Journal.findById(journalId);
    if (!journal.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect("/profile");
    }
    next();
}

// Middleware function to set the postedToday property for a user
module.exports.setPostedToday = async(req, res, next) => {
    try{
        const user = await User.findById(req.user._id);
        const today = correctDate(res.locals.cookie['today']);
        const post = await Post.find({"author": user, "date": today});
        if(post.length){
            user.postedToday = true;
            await user.save();
        } else {
            user.postedToday = false;
            await user.save();
        }
    }catch(e){
        console.log("setPostedToday middleware failed:", e);
    }
    next();
}

// Middleware function to block duplicate post submissions
module.exports.blockDuplicatePost = async (req, res, next) => {
    const today = correctDate(res.locals.cookie['today']);
    const post = await Post.find({"author": req.user, "date": today});
    if(post.length){
        req.flash("error", "Sorry, you've already posted once today!");
        return res.redirect("/home");
    } else next();
}

// Middleware function to reset the post streak for a user
module.exports.resetPostStreak = async(req, res, next) => {
    const user = await User.findById(req.user._id);
    try{ 
        const yesterday = correctDate(res.locals.cookie['yesterday']);
        const yesterdayPost = await Post.find({"author": user, "date": yesterday});
        if(yesterdayPost.length == 0) {
            if(user.postedToday){
                await user.updateOne({$set: {postStreak:  1}}); 
                await user.save();
            } else {
                await user.updateOne({$set: {postStreak:  0}}); 
                await user.save();
            }     
        } 
    } catch(e) {
        console.log("resetPostStreak middleware failed:", e)
    }
    next();
}


module.exports.searchAndFilterPosts = async(req, res, next) => {
    const queryKeys = Object.keys(req.query); // Extract query parameters
    if(queryKeys.length) {
        const dbQueries = []; // Create array to store database queries
        let {text, date, rating, country, ageGroup, gender, image} = req.query;
        // Create regular expression object to search for matching text in 'body' field of posts
        text = new RegExp(escapeRegExp(text), "gi"); 
        addQuery('body', text, dbQueries);

        // Create regular expression object to search for matching dates in 'date' field of posts
        if(date) {
            date = new Date(date).toLocaleDateString( 'en-US',
            {year: 'numeric', month: 'short', day: 'numeric', timeZone: "UTC"}); // keep it UTC in order to search date string only
            date = new RegExp(escapeRegExp(date), "gi");
            dbQueries.push({date: date});
        }
    
        //Add queries to filter posts based rating, demographic, image
        if(rating) {dbQueries.push({rating: {$in: rating}})}
        if(country){dbQueries.push({authorCountry: country})}
        if(ageGroup){dbQueries.push({authorAgeGroup: ageGroup})}
        if(gender){dbQueries.push({authorGender: gender})}
        if(image){dbQueries.push({image: {$exists: true}})}
        res.locals.dbQuery = dbQueries.length ? {$and: dbQueries} : {};
    }
    res.locals.query = req.query; // Set the final query object in res.locals
    // Modify res.locals.paginateUrl to include the updated query parameters
    const delimiter = queryKeys.length ? '&' : '?';
	queryKeys.splice(queryKeys.indexOf('page'), 1);
	res.locals.paginateUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g, '') + `${delimiter}page=`;

	next();
}

module.exports.filterPosts = async(req, res, next) => {
    const today = correctDate(res.locals.cookie['today']);
    const queryKeys = Object.keys(req.query); 
    const dbQueries = [{date: today}];
    if(queryKeys.length) {
        //Add queries to filter posts based rating, demographic, image
        let {rating, country, image, ageGroup, gender} = req.query;
        if(rating) {dbQueries.push({rating: {$in: rating}});}
        if(country){dbQueries.push({authorCountry: country})}
        if(ageGroup){dbQueries.push({authorAgeGroup: ageGroup})}
        if(gender){dbQueries.push({authorGender: gender})}
        if(image){dbQueries.push({image: {$exists: true}})}
        // Set the final query object in res.locals.dbQuery
        res.locals.dbQuery = dbQueries.length ? {$and: dbQueries} : {};
    }
    // Set the original query parameters in res.locals.query
    res.locals.query = req.query;
	next();
}

module.exports.filterCharts = async(req, res, next) => {
    const queryKeys = Object.keys(req.query); 
    const dbQueries = {};
    const userQueries = {};

    if(queryKeys.length) {
        let {country, ageGroup, date, gender} = req.query;
        //Add query to filter based on date, demographics
        if(date) {
            date = new Date(date).toLocaleDateString( 'en-US',
            {timeZone: "UTC", year: 'numeric', month: 'short', day: 'numeric'}); // keep it UTC in order to search date string only
            dbQueries['date'] = date;
        }
        if(country){
            dbQueries['authorCountry'] = country; 
            userQueries['country.name'] = country;
        }
        if(gender){
            dbQueries['authorGender'] = gender;
            userQueries['gender'] =gender;
        }
        if(ageGroup){
            dbQueries['authorAgeGroup'] = ageGroup;
            userQueries['ageGroup'] = ageGroup;
        }
    }
    res.locals.dbQuery = dbQueries;
    res.locals.userQuery = userQueries;
    res.locals.query = req.query;
	next();
}
