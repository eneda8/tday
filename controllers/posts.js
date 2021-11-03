const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const {getToday, getTimestamp, within24Hours} = require("../utils/getToday");
const ObjectID = require('mongodb').ObjectID;
const {cloudinary} = require("../cloudinary");
const countries = require("../countries");

module.exports.renderNewForm = (req, res) => { 
    res.render("posts/new")
}

module.exports.createPost = async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const post = new Post(req.body.post);
    post.date = getToday();
    post.timestamp = getTimestamp();
    post.image = req.file;
    post.author = req.user._id;
    post.authorCountry = user.country.name;
    post.authorGender = user.gender;
    post.authorUsername = user.username;
    post.authorDisplayName = user.displayName;
    post.authorAgeGroup = user.ageGroup;
    post.authorID = user._id;
    user.posts.unshift(post);
    user.postedToday = true;
    user.postStreak ++; 
    await post.save();
    user.todaysPost = post._id; 
    // update user average
    let userAverage;
    await Post.aggregate([
        {$match: {"author": user._id}},
        {$group: {_id: null, avgRating: {$avg: "$rating"}}}
    ]).then(function(res) {
        userAverage = res[0].avgRating.toFixed(2)
    });
    await user.updateOne({$set: {average:  userAverage}});
    await user.save();
    // ----------------------------
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
    await post.populate({
        path: "comments",
        populate:{path: "author"}
    }).execPopulate();
    if(!post){
        req.flash("error", "Rating not found!")
        return res.redirect("/home");
    }
    res.render("posts/show", {user, post, within24Hours, getToday, title: `@${post.author.username}'s day / t'day `})
}

module.exports.bookmarkPost = async(req, res) => {
    try{
        const {id} = req.params;
        const post = await Post.findById(id);
        const user = await User.findById(req.user._id);
        user.bookmarks.unshift(post);
        user.save()
        req.flash("success", "Bookmark added!");
        // res.redirect(`/u/${user.username}#nav-bookmarks`)
        res.redirect("back")
    } catch (e){
        console.log(e)
        req.flash("error", "Oops something went wrong!");
        res.redirect(`/posts/${post._id}`)
    }   
}

module.exports.unbookmarkPost = async(req, res) => {
    try{
        const {id} = req.params;
        const user = await User.findById(req.user._id);
        await user.bookmarks.pull(id);
        await user.save()
        req.flash("success", "Bookmark removed!");
    } catch (e){
        console.log(e)
        req.flash("error", "Oops something went wrong!");
    }   
    res.redirect("back")
}

module.exports.renderEditForm = async (req,res) => {
    const post = await Post.findById(req.params.id);
    if(!post){
        req.flash("error", "Rating not found!")
        return res.redirect("/home");
    }
    res.render("posts/edit", {post, title: "Edit rating / t'day"})
}

module.exports.updatePost = async (req,res) => {
    const user = await User.findById(req.user._id);
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
    
     // update user average
    let userAverage;
    await Post.aggregate([
        {$match: {"author": user._id}},
        {$group: {_id: null, avgRating: {$avg: "$rating"}}}
    ]).then(function(res) {
        userAverage = res[0].avgRating.toFixed(2)
    });
    await user.updateOne({$set: {average:  userAverage}});
    await user.save();
    // ----------------------------
    req.flash("success", "Rating updated!");
    res.redirect(`/posts/${post._id}`)
}

module.exports.deletePost = async(req, res) => {
    const {id} = req.params;
    const user = await User.findById(req.user._id).populate("posts");
    const today = getToday();
    const post = await Post.findById(id).populate("author").populate("comments");

    if(post.date === today){
        user.posts.shift();
        user.postedToday = false;
        user.todaysPost = ""
        user.postStreak --;
    } else {
        user.posts.pull(id)
    }
    if(post.image) await cloudinary.uploader.destroy(post.image.filename);
    await post.remove();
    // update user average
    let userAverage;
    await Post.aggregate([
        {$match: {"author": user._id}},
        {$group: {_id: null, avgRating: {$avg: "$rating"}}}
    ]).then(function(res) {
        userAverage = res[0].avgRating.toFixed(2)
    });
    await user.updateOne({$set: {average:  userAverage}});
    await user.save();
    // ----------------------------

    req.flash("success", "Rating deleted");
    res.redirect(`/u/${user.username}`);
}

module.exports.search = async (req, res) => {
    const user = await User.findById(req.user._id).populate("posts");
    const {dbQuery} = res.locals;
    let posts, docsFound;
    delete res.locals.dbQuery;
    if(dbQuery) {
        posts = await Post.paginate(dbQuery, {
            page: req.query.page || 1,
            limit: 10,
            sort: {"createdAt": -1},
            populate: "author"
        })
        posts.page = Number(posts.page);
        docsFound = posts.pages > 1 ? posts.pages*10 : posts.docs.length;
        for(let post of posts.docs) {
            const doesUserExist = await User.exists({_id: post.author})
            if(!doesUserExist) {
                console.log("problem with this post:", post._id)
                await post.remove()
                res.redirect("/")
            }
        }
        if(!posts.docs.length && res.locals.query) {
            res.locals.error = "No results match that query. Please try a broader search.";
        }
    }
    res.render("posts/search", {posts, user, within24Hours, countries, docsFound, title: "Search / t'day"});
}