const mongoose = require("mongoose");
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const faker = require('faker');
const countries = require("./countries");

require("dotenv").config();


mongoose.connect("mongodb://localhost:27017/todai", {
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
    // for(let i =0; i < 100; i++) {
    //     const email = faker.internet.email();
    //     const username = faker.internet.userName();
    //     const password = faker.internet.password();
    //     const birthday = faker.date.past();
    //     const gender = ["female", "male"][Math.round(Math.random())];
    //     const country = faker.address.country();
    //     const user = new User({email, username, password, birthday, gender});
    //     // user.country.name = country;
    //     user.country.flag = countries[country];
    //     // //american seed data-----------
    //     user.country.name = "United States of America";
    //     user.country.flag = "/images/flags/US.png";
    //     // // -------------
    //     user.avatar = {}; 
    //     user.avatar.path = faker.internet.avatar();
    //     user.displayName = faker.name.findName();
    //     user.bio = "This is an fake account used to generate data for demonstration purposes."
    //     user.coverColor = faker.internet.color();
    //     user.postedToday = false;
    //     const registeredUser = await User.register(user, password);
    // }

    // /make fake posts
    for(let i = 0; i<1201; i++){
        const rating = Math.floor(Math.random() * 5) + 1;
        const body = faker.lorem.sentence();
        const user = await User.findOne().where({ "postedToday" : false })      
        // post.image = faker.image();
        if(user){
            const post = new Post({rating, body});
            post.author = user;
            user.postedToday = true;
            user.posts.unshift(post);
            user.todaysPost = post._id;
            await post.save();
            await user.save();
        }
    }
    //make fake comments
    // for(let i = 0; i<2000; i++){
    //     const body = faker.lorem.sentence();
    //     const timestamp = new Date().toLocaleString("en-US");
    //     const comment = new Comment({body, timestamp});
    //     const randUser = await User.aggregate([{ $sample: { size: 1 } }]);
    //     const randPost = await Post.aggregate([{ $sample: { size: 1 } }]);
    //     const user = await User.findById(randUser[0]._id);
    //     const post = await Post.findById(randPost[0]._id);
    //     comment.author = user._id;
    //     comment.post = post._id;
    //     await post.comments.push(comment);
    //     await user.comments.unshift(comment);
    //     await comment.save();
    //     await user.save();
    //     await post.save();
    //     console.log(comment)
    // }
}

seedDB().then(() => {
    mongoose.connection.close();
})