// Seed realistic journal posts with real sentences
const mongoose = require("mongoose");
const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment"); // Fix: Add Comment model
require("dotenv").config();

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl);

// Real journal-like sentences instead of lorem ipsum
const journalEntries = [
    "Had a great day at work today, feeling productive!",
    "Spent time with family, feeling grateful.",
    "Feeling a bit stressed about upcoming deadlines.",
    "Beautiful weather today, went for a nice walk.",
    "Cooked a new recipe for dinner, turned out amazing!",
    "Had some challenges today but pushed through.",
    "Feeling really happy and content with life right now.",
    "A bit tired today, need more rest.",
    "Made progress on my personal goals today.",
    "Enjoyed a quiet evening reading a good book.",
    "Had an interesting conversation with a friend.",
    "Feeling motivated and energized!",
    "Today was challenging but I learned something new.",
    "Grateful for the small moments of joy today.",
    "Feeling overwhelmed but taking it one step at a time.",
    "Had a productive morning workout.",
    "Enjoyed quality time with loved ones.",
    "Feeling creative and inspired today.",
    "A peaceful day with no major ups or downs.",
    "Accomplished everything on my to-do list!",
    "Feeling anxious about some things, but staying positive.",
    "Had a lovely coffee with a friend this morning.",
    "Work was intense today but rewarding.",
    "Feeling thankful for my health and wellbeing.",
    "Today was tough but tomorrow is a new day.",
    "Made someone smile today, that felt good.",
    "Feeling content and at peace.",
    "Had a breakthrough moment today!",
    "Spent the day doing things I love.",
    "Feeling blessed and fortunate.",
    "A bit lonely today, missing some people.",
    "Had an adventure today, tried something new!",
    "Feeling proud of myself for my progress.",
    "Today reminded me to be more patient.",
    "Enjoyed the simple pleasures in life today.",
    "Feeling hopeful about the future.",
    "Had a good laugh today, needed that!",
    "Reflecting on how far I've come.",
    "Today was okay, nothing special.",
    "Feeling energized after spending time outdoors.",
    "Had a meaningful conversation that made me think.",
    "Feeling calm and centered today.",
    "Today tested my patience but I managed.",
    "Enjoyed a relaxing evening at home.",
    "Feeling optimistic about upcoming opportunities.",
    "Had a moment of clarity about something important.",
    "Today was better than expected!",
    "Feeling grateful for the support system I have.",
    "Spent time on a hobby I love today.",
    "Feeling accomplished and satisfied with today."
];

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
    console.log("Database connected - creating realistic posts...");

    // Get all users
    const users = await User.find({});

    if(users.length === 0) {
        console.log("No users found! Please create users first.");
        mongoose.connection.close();
        return;
    }

    console.log(`Found ${users.length} users`);

    // Create 1500 posts distributed across users
    for(let i = 0; i < 1500; i++){
        try {
            // Pick random user
            const randomUser = users[Math.floor(Math.random() * users.length)];

            // Random rating 1-5
            const rating = Math.floor(Math.random() * 5) + 1;

            // Pick random realistic journal entry
            const body = journalEntries[Math.floor(Math.random() * journalEntries.length)];

            const post = new Post({rating, body});

            // Add image to half of posts
            if(i % 2 == 0) {
                post.image = {}
                post.image.path = "https://picsum.photos/350?random=" + i;
            }

            post.date = new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'});
            post.author = randomUser;
            post.authorID = randomUser._id;
            post.authorCountry = randomUser.country.name;
            post.authorUsername = randomUser.username;
            post.authorGender = randomUser.gender;
            post.authorAgeGroup = randomUser.ageGroup;

            await post.save();

            // Update user
            randomUser.posts.unshift(post);

            // Update user average
            const userPosts = await Post.find({"author": randomUser._id});
            const avgRating = userPosts.reduce((sum, p) => sum + p.rating, 0) / userPosts.length;
            randomUser.average = avgRating.toFixed(2);

            await randomUser.save();

            if(i % 100 === 0) {
                console.log(`✓ Created ${i} posts...`);
            }
        } catch(e) {
            console.log("Error creating post:", e.message);
        }
    }

    console.log("✅ All 1500 realistic posts created!");
    mongoose.connection.close();
});
