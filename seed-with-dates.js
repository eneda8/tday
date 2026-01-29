// Seed posts with varied dates and realistic content
const mongoose = require("mongoose");
const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment");
require("dotenv").config();

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl);

// Real journal-like sentences
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
    "Feeling energized after spending time outdoors."
];

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
    console.log("Database connected");

    try {
        // STEP 1: Delete posts from Jan 28 & 29, 2026
        console.log("Deleting posts from Jan 28-29, 2026...");
        const deleteResult = await Post.deleteMany({
            date: { $in: ["Jan 28, 2026", "Jan 29, 2026"] }
        });
        console.log(`✓ Deleted ${deleteResult.deletedCount} posts`);

        // STEP 2: Reset all users' postedToday to false
        console.log("Resetting all users...");
        await User.updateMany({}, {
            $set: { postedToday: false },
            $unset: { todaysPost: "" }
        });
        console.log("✓ All users reset");

        // STEP 3: Get all users
        const users = await User.find({});
        console.log(`Found ${users.length} users`);

        if(users.length === 0) {
            console.log("❌ No users found!");
            mongoose.connection.close();
            return;
        }

        // STEP 4: Create posts for the past 30 days
        console.log("Creating posts for past 30 days...");

        const postsPerDay = 50; // 50 posts per day
        const daysBack = 30;

        for(let day = 0; day < daysBack; day++) {
            const date = new Date();
            date.setDate(date.getDate() - day);
            const dateString = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            for(let i = 0; i < postsPerDay; i++) {
                try {
                    // Random user
                    const randomUser = users[Math.floor(Math.random() * users.length)];

                    // Random rating and entry
                    const rating = Math.floor(Math.random() * 5) + 1;
                    const body = journalEntries[Math.floor(Math.random() * journalEntries.length)];

                    const post = new Post({
                        rating,
                        body,
                        date: dateString,
                        author: randomUser._id,
                        authorID: randomUser._id,
                        authorCountry: randomUser.country.name,
                        authorUsername: randomUser.username,
                        authorGender: randomUser.gender,
                        authorAgeGroup: randomUser.ageGroup
                    });

                    // Add image to some posts
                    if(Math.random() > 0.5) {
                        post.image = {
                            path: `https://picsum.photos/350?random=${Date.now()}`
                        };
                    }

                    await post.save();
                } catch(e) {
                    console.log(`Error: ${e.message}`);
                }
            }

            console.log(`✓ Created ${postsPerDay} posts for ${dateString}`);
        }

        console.log(`\n🎉 Successfully created ${postsPerDay * daysBack} posts!`);
        console.log("✅ All done!");

    } catch(e) {
        console.error("Error:", e);
    } finally {
        mongoose.connection.close();
    }
});
