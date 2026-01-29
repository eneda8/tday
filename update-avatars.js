// Quick script to update all user avatars
const mongoose = require("mongoose");
const User = require("./models/user");
require("dotenv").config();
const { createAvatar } = require('@dicebear/core');
const { avataaars, bottts, personas, funEmoji } = require('@dicebear/collection');

// Helper function to generate random DiceBear avatar
function generateAvatar(seed) {
    const styles = [avataaars, bottts, personas, funEmoji];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const avatar = createAvatar(randomStyle, {
        seed: seed || Math.random().toString(36),
        size: 200
    });
    return avatar.toDataUri();
}

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
    console.log("Database connected - updating avatars...");

    const users = await User.find({});
    console.log(`Found ${users.length} users to update`);

    for(let user of users){
        const newAvatar = generateAvatar(user.username);
        await user.updateOne({$set: {"avatar.path": newAvatar}});
        console.log(`✓ Updated ${user.username}`);
    }

    console.log("All avatars updated!");
    mongoose.connection.close();
});
