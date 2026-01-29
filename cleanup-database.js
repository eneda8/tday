const mongoose = require("mongoose");
const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment");
require("dotenv").config();

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const cleanup = async () => {
    try {
        // 1. Delete all posts from today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        console.log("Deleting all posts from today...");
        const deletedPosts = await Post.deleteMany({
            date: { $gte: today }
        });
        console.log(`✓ Deleted ${deletedPosts.deletedCount} posts from today`);

        // 2. Reset all users' postedToday flag
        console.log("Resetting all users' postedToday flags...");
        await User.updateMany({}, { $set: { postedToday: false, todaysPost: null } });
        console.log("✓ Reset all users' postedToday flags");

        // 3. Get count of fake users (isVerified: false)
        const fakeUserCount = await User.countDocuments({ isVerified: false });
        console.log(`\nFound ${fakeUserCount} fake users (isVerified: false)`);

        // 4. Delete half of the fake users
        const usersToDelete = Math.floor(fakeUserCount / 2);
        console.log(`Deleting ${usersToDelete} fake users...`);

        const fakeUsers = await User.find({ isVerified: false })
            .limit(usersToDelete)
            .select('_id username');

        for (let user of fakeUsers) {
            // Delete user's posts
            await Post.deleteMany({ author: user._id });
            // Delete user's comments
            await Comment.deleteMany({ author: user._id });
            // Delete the user
            await User.deleteOne({ _id: user._id });
        }

        console.log(`✓ Deleted ${usersToDelete} fake users and their posts/comments`);

        // 5. Show final counts
        const finalUserCount = await User.countDocuments({ isVerified: false });
        const finalPostCount = await Post.countDocuments({});
        const realUserCount = await User.countDocuments({ isVerified: true });

        console.log("\n--- Final Database Stats ---");
        console.log(`Real users: ${realUserCount}`);
        console.log(`Fake users: ${finalUserCount}`);
        console.log(`Total posts: ${finalPostCount}`);
        console.log("✓ Cleanup complete!");

    } catch (error) {
        console.error("Error during cleanup:", error);
    } finally {
        await mongoose.connection.close();
    }
};

cleanup();
