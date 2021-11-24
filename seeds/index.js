const mongoose = require("mongoose");
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const faker = require('faker');
const countries = require("./countries");
require("dotenv").config();
const {AvatarGenerator} = require("random-avatar-generator");
const generator = new AvatarGenerator();

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
    // for(let i =0; i < 27; i++) {
    //     const {username, name, email, avatar, dob} = faker.helpers.contextualCard();
    //     const password = faker.internet.password();
    //     // const birthyear = dob.getFullYear();
    //     // if(birthyear >= 1901 && birthyear <=1927){
    //     //     user.ageGroup = "Greatest Generation"
    //     // }else if(birthyear >=1928 && birthyear <= 1945){
    //     //     user.ageGroup = "Silent Generation"
    //     // } else if(birthyear >=  1946 && birthyear <= 1964){
    //     //     user.ageGroup = "Baby Boomers"
    //     // } else if (birthyear >= 1965  && birthyear <=1980 ){
    //     //     user.ageGroup = "Gen X"
    //     // } else if (birthyear >= 1981 && birthyear <= 1996) {
    //     //     user.ageGroup = "Millennials"
    //     // } else if (birthyear >= 1997 && birthyear <= 2012){
    //     //     user.ageGroup = "Gen Z"
    //     // } 
    //     const ageGroup = "Gen Z"
    //     const displayName = name;
    //     const gender = ["female", "male"][Math.round(Math.random())];
    //     const user = new User({email, username, displayName, password, ageGroup, gender});
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
    //             post.image.path = "https://placeimg.com/640/480/any";
    //         }     
    //         post.author = user;
    //         post.authorID = user._id;
    //         post.authorCountry = user.country.name;
    //         post.authorUsername = user.username;
    //         post.authorGender = user.gender;
    //         post.authorAgeGroup= user.ageGroup;
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

    const users = await User.find({});
    for(let user of users){
        // UPDATE AVATARS
        await user.updateOne({$set: {"avatar.path": generator.generateRandomAvatar()}});
        console.log("user updated:", user.avatar.path)
        await user.save();
        // if(user.birthyear >= 1901 && user.birthyear <=1927){
        //     user.ageGroup = "Greatest Generation"
        // }else if(user.birthyear >=1928 && user.birthyear <= 1945){
        //     user.ageGroup = "Silent Generation"
        // } else if(user.birthyear >=  1946 && user.birthyear <= 1964){
        //     user.ageGroup = "Baby Boomers"
        // } else if (user.birthyear >= 1965  && user.birthyear <=1980 ){
        //     user.ageGroup = "Gen X"
        // } else if (user.birthyear >= 1981 && user.birthyear <= 1996) {
        //     user.ageGroup = "Millennials"
        // } else if (user.birthyear >= 1997 && user.birthyear <= 2012){
        //     user.ageGroup = "Gen Z"
        // } 
        // await user.save();
    }



    // fix posts
    // const posts = await Post.find({}).populate("author");
    // for(let post of posts){
    //     try{
    //         post.authorAgeGroup = post.author.ageGroup;
    //         await post.save();
    //     } catch(e) {
    //         console.log(e)
    //         if(!post.author){
    //             post.remove();
    //             console.log("post deleted")
    //         }
    //     }
    // }
    // const posts = await Post.find({"image": {$exists: true}, "authorID": {$ne: "6119678323ac00ab29f09ceb"}})
    // console.log(posts.length)
    // for(let post of posts){
    //     post.image.path = "https://placeimg.com/640/480/any"
    //     console.log("changed post")
    //     await post.save()
    // }
    //make fake comments
    // for(let i = 0; i<4000; i++){
    //     const body = faker.lorem.sentence();
    //     const timestamp = new Date().toLocaleString("en-US");
    //     const comment = new Comment({body, timestamp});
    //     const randUser = await User.aggregate([{ $sample: { size: 1 } }]);
    //     const randPost = await Post.aggregate([{$match: {"date": "Oct 29, 2021"}}, { $sample: { size: 1 } }]);        
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