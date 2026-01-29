// Simple script to seed posts ONLY
const mongoose = require("mongoose");
const User = require("./models/user");
const Post = require("./models/post");
const faker = require('faker');
require("dotenv").config();

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
    console.log("Database connected - creating posts...");

    // Make fake posts
    for(let i = 0; i < 1500; i++){
        try {
            const rating = Math.floor(Math.random() * 5) + 1;
            let body;
            if(i % 2 == 0) {
                body = faker.lorem.sentence()
            } else {
                body = faker.lorem.sentences()
            }

            const user = await User.findOne().where({ "isVerified": false }).where({"postedToday": false});

            if(user){
                const post = new Post({rating, body});
                if(i % 2 == 0) {
                    post.image = {}
                    post.image.path = "https://picsum.photos/350?random";
                }

                post.date = new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})
                post.author = user;
                post.authorID = user._id;
                post.authorCountry = user.country.name;
                post.authorUsername = user.username;
                post.authorGender = user.gender;
                post.authorAgeGroup = user.ageGroup;

                await post.save();

                user.postedToday = true;
                user.posts.unshift(post);
                user.todaysPost = post._id;

                // Update post streak
                const today = new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'});
                let yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                yesterday = yesterday.toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'});
                const yesterdayPost = await Post.find({"author": user, "date": yesterday});

                if(!yesterdayPost.length) {
                    user.postStreak = 1;
                } else {
                    user.postStreak++
                }

                // Update user average
                let userAverage;
                await Post.aggregate([
                    {$match: {"author": user._id}},
                    {$group: {_id: null, avgRating: {$avg: "$rating"}}}
                ]).then(function(res) {
                    userAverage = res[0].avgRating.toFixed(2)
                });

                await user.updateOne({$set: {average: userAverage}});
                await user.save();

                if(i % 100 === 0) {
                    console.log(`Created ${i} posts...`);
                }
            }
        } catch(e) {
            console.log(e)
        }
    }

    console.log("✅ All posts created!");
    mongoose.connection.close();
});
