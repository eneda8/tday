const mongoose = require("mongoose");
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const faker = require('faker');
const countries = require("./countries");
require("dotenv").config();

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



const seedDB = async () => {
    // register new users with faker
    // for(let i =0; i < 524; i++) {
    //     const {username, name, email, avatar, dob} = faker.helpers.contextualCard();
    //     const password = faker.internet.password();
    //     const birthday = dob;
    //     const birthyear = dob.getFullYear();
    //     const displayName = name;
    //     const gender = ["female", "male"][Math.round(Math.random())];
    //     const user = new User({email, username, displayName, password, birthday, birthyear, gender});
    //     const country = faker.address.country();
    //     user.country.name = country;
    //     user.country.flag = countries[country];
    //     // //american seed data-----------
    //     // user.country.name = "United States of America";
    //     // user.country.flag = "/images/flags/US.png";
    //     // // -------------
    //     user.avatar = {};
    //     user.avatar.path = avatar;
    //     user.bio = "This is a fake account used to generate data for demonstration purposes."
    //     user.coverColor = faker.internet.color();
    //     user.postedToday = false;
    //     try{
    //     const registeredUser = await User.register(user, password);
    //     }catch(e){
    //         console.log(e)
    //         next()
    //     }
    // }

    // /make fake posts
    // for(let i = 0; i<1000; i++){
    //     const rating = Math.floor(Math.random() * 5) + 1;
    //     let body;
    //     if(i % 2 == 0 ) {
    //         body = faker.lorem.sentence()
    //     } else {body = faker.lorem.sentences()}
    //     const user = await User.findOne().where({ "postedToday" : false }) .where({"bio": {$ne: "creator of this website" }})
    //     if(user){
    //         const post = new Post({rating, body});
    //         if(i % 2 == 0) {
    //             post.image = {}
    //             post.image.path = faker.image.image();
    //         }     
    //         post.author = user;
    //         post.authorCountry = user.country.name;
    //         post.authorUsername = user.username;
    //         post.authorGender = user.gender;
    //         // post.authorBirthyear = user.birthyear
    //         post.authorDisplayName = user.displayName;
    //         await post.save();
    //         user.postedToday = true;
    //         user.posts.unshift(post);
    //         user.todaysPost = post._id;
    //         user.postStreak ++; 
    //         // update user average
    //         let userAverage;
    //         await Post.aggregate([
    //             {$match: {"author": user._id}},
    //             {$group: {_id: null, avgRating: {$avg: "$rating"}}}
    //         ]).then(function(res) {
    //          userAverage = res[0].avgRating.toFixed(2)
    //          });
    //         await user.updateOne({$set: {average:  userAverage}});
    //         await user.save();
    //      // ----------------------------
    //     }
    // }

    //fix user data

    // const users = await User.find().where({"bio": {$ne: "creator of this website" }});
    // for(let user of users){
    //     await user.updateOne({$set: {"user.avatar.path":  faker.image.image()}});
    //     await user.save();
    // }

    // fix posts
    // const posts = await Post.find({}).populate("author");
    // for(let post of posts){
    //     if(!post.authorUsername) {
    //         try{
    //             await post.updateOne({$set: {"authorUsername": post.author.username}})
    //             await post.save()
    //         } catch(e) {
    //             if(!post.author){
    //                 post.remove();
    //             }
    //         }
    //     }
    // }
    
    //make fake comments
    // for(let i = 0; i<2500; i++){
    //     const body = faker.lorem.sentence();
    //     const timestamp = new Date().toLocaleString("en-US");
    //     const comment = new Comment({body, timestamp});
    //     const randUser = await User.aggregate([{ $sample: { size: 1 } }]);
    //     const randPost = await Post.aggregate([{ $sample: { size: 1 } }]);
    //     const user = await User.findById(randUser[0]._id);
    //     const post = await Post.findById(randPost[0]._id);
    //     console.log(post._id);
    //     comment.author = user;
    //     comment.post = post;
    //     await post.comments.push(comment);
    //     await user.comments.unshift(comment);
    //     await comment.save();
    //     await user.save();
    //     await post.save();
    // }

}

seedDB().then(() => {
    mongoose.connection.close();
})