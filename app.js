const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Joi = require("joi");
const {postSchema} = require("./schemas.js");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const Post = require("./models/post");
const { join } = require("path");

mongoose.connect("mongodb://localhost:27017/todai", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true})); 
app.use(methodOverride("_method"));

const getToday = function() {
    const date = new Date() 
    const today = (date.getMonth() +1).toString()+ '/' + date.getDate().toString()+ "/" + date.getFullYear().toString().slice(2)  
    return today;
  }
  
const validatePost = (req, res, next) => {  
    const {error} = postSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get("/", (req,res) => {
    res.render("home")
})

app.get("/index", catchAsync(async (req, res) => {
    const posts = await Post.find({}).sort({date:-1});
    res.render("index", {posts})
}))

app.get("/today", catchAsync(async (req, res) =>{
    const today = getToday();
    const posts = await Post.find({date: today}).sort({date:-1});
    res.render("today", {posts})
}))

app.post("/", validatePost, catchAsync(async (req,res) => {
    const post = new Post(req.body.post)
    await post.save()
    res.redirect(`/posts/${post._id}`)
}))

app.get("/posts/:id/edit", catchAsync(async (req,res) => {
    const post = await Post.findById(req.params.id)
    res.render("edit", {post})
}))

app.get("/posts/:id", catchAsync(async (req,res) => {
    const post = await Post.findById(req.params.id)
    res.render("show", {post})
}))

app.put("/posts/:id", validatePost, catchAsync(async (req,res) => {
    const {id} = req.params;
    const post = await Post.findByIdAndUpdate(id, {...req.body.post}) 
    res.redirect(`/posts/${post._id}`)
}))

app.delete("/posts/:id", catchAsync(async (req,res) => {
    const {id} = req.params;
    await Post.findByIdAndDelete(id);
    res.redirect("/today")
}))

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Oh no, something went wrong!"
    res.status(statusCode).render("error", {err});
})

app.listen(3000, () => {
    console.log("serving on port 3000")
})

