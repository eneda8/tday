const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Post = require("./models/post");

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true})); 
app.use(methodOverride("_method"));

app.get("/", (req,res) => {
    res.render("home")
})

app.get("/today", async (req, res) =>{
    const posts = await Post.find();
    res.render("today", {posts})
})

app.post("/", async (req,res) => {
    const post = new Post(req.body.post)
    await post.save()
    res.redirect(`/posts/${post._id}`)
})

app.get("/posts/:id/edit", async (req,res) => {
    const post = await Post.findById(req.params.id)
    res.render("edit", {post})
})

app.get("/posts/:id", async (req,res) => {
    const post = await Post.findById(req.params.id)
    res.render("show", {post})
})

app.put("/posts/:id", async (req,res) => {
    const {id} = req.params;
    const post = await Post.findByIdAndUpdate(id, {...req.body.post}) 
    res.redirect(`/posts/${post._id}`)
})

app.delete("/posts/:id", async (req,res) => {
    const {id} = req.params;
    await Post.findByIdAndDelete(id);
    res.redirect("/today")
})

app.listen(3000, () => {
    console.log("serving on port 3000")
})

