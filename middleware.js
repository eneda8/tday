const ExpressError = require("./utils/ExpressError");
const {postSchema, userSchema, commentSchema} = require("./schemas.js");
const Post = require("./models/post");
const Comment = require("./models/comment");
const User = require("./models/user");
const Journal = require("./models/journal");
const {getToday} = require("./utils/getToday");

function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
}

module.exports.validatePost = (req, res, next) => {  
    const {error} = postSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateComment = (req, res, next) => {
    const {error} = commentSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash("error", "You must be signed in to do that!");
        return res.redirect("/login");
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const post = await Post.findById(id);
    if (!post.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/posts/${id}`)
    }
    next();
}

module.exports.isCommentAuthor = async(req, res, next) => {
    const {id, commentId} = req.params; 
    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/posts/${id}`)
    }
    next();
}

module.exports.isJournalAuthor = async(req, res, next) => {
    const {id, journalId} = req.params; 
    const journal = await Journal.findById(journalId);
    if (!journal.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/u/${id}`)
    }
    next();
}

module.exports.setPostedToday = async(req, res, next) => {
    const today = getToday();
    const user = await User.findById(req.user._id);
    const post = await Post.find({"author": user, "date": today});
    if(post.length){
        user.postedToday = true;
        await user.save();
    } else {
        user.postedToday = false;
        await user.save()
    }
    next()
}

module.exports.blockDuplicatePost = async (req, res, next) => {
    const today = getToday();
    const user = await User.findById(req.user._id);
    const post = await Post.find({"author": user, "date": today});
    if(post.length){
        req.flash("error", "Sorry, you've already posted once today!")
        return res.redirect("/home")
    } else next()
}

module.exports.checkPostStreak = async(req, res, next) => {
    const today = new Date()
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() -1)
    yesterday = yesterday.toLocaleDateString(
        'en-US',
        {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        }
    );
    const user = await User.findById(req.user._id);
    const yesterdayPost = await Post.find({"author": user, "date": yesterday});
    const todayPost = await Post.find({"author": user, "date": getToday()})
    if(!yesterdayPost.length) {
        if(todayPost.length){
            await user.updateOne({$set: {postStreak:  1}});      
        } else {
            await user.updateOne({$set: {postStreak:  0}}); 
        }     
        user.save()
        next()
    } else next() 
}

module.exports.isAccountOwner = async(req, res, next) => {
    const {username} = req.params; 
    const user = await User.find({"username": username});
    if (!user._id == req.user._id) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect("/home")
    }
    next();
}

module.exports.searchAndFilterPosts = async(req, res, next) => {
    const queryKeys = Object.keys(req.query); //extract keys from query string object and store in an array as string values
    if(queryKeys.length) {
        const dbQueries = [];
        let {search, rating} = req.query;
        if(search) {
            search = new RegExp(escapeRegExp(search), "gi");
            dbQueries.push( {$or: [ //match any of these 
                {body: search},
            //     {
            //         $lookup: 
            //         {
            //         from: "comment",
            //         localField: "comments",
            //         foreignField: "_id",
            //         as: "comment"
            //     },
            //     $match: {
            //         "body" : search
            //     }
            // }
            ]});
        }
        if(rating) {
            dbQueries.push({rating: {$in: rating}});
        }
        res.locals.dbQuery = dbQueries.length ? {$and: dbQueries} : {};
    }
    res.locals.query = req.query;
    queryKeys.splice(queryKeys.indexOf('page'), 1);
    const delimiter = queryKeys.length ? "&" : "?";
    res.locals.paginateUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g, '') + `${delimiter}page=`;

	next();
}