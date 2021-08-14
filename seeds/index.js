const mongoose = require("mongoose");
const User = require("../models/user");
const Post = require("../models/post");
const faker = require('faker');
const countries = require("../countries");

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
    // for(let i =0; i < 200; i++) {
    //     const email = faker.internet.email();
    //     const username = faker.internet.userName();
    //     const password = faker.internet.password();
    //     const birthday = faker.date.past();
    //     const gender = ["female", "male"][Math.round(Math.random())];
    //     const country = faker.address.country();
    //     const user = new User({email, username, password, birthday, gender});
    //     user.country.name = country;
    //     let selectedCountry = countries.filter(obj => Object.values(obj).includes(country));
    //     if(selectedCountry !== undefined){
    //         user.country.flag = selectedCountry["flag"]
    //     }
    //     user.avatar = {}; 
    //     user.avatar.path = faker.internet.avatar();
    //     user.displayName = faker.name.findName();
    //     user.bio = faker.lorem.sentence();
    //     user.coverColor = faker.internet.color();
    //     const registeredUser = await User.register(user, password);
    // }

    // /make fake posts
    for(let i = 0; i<600; i++){
        const rating = Math.floor(Math.random() * 5) + 1;
        const body = faker.lorem.sentence();
        const post = new Post({rating, body});
        // post.image = faker.image();
        const user = await User.random();
        post.author = user;
        user.posts.unshift(post);
        await post.save();
        await user.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close();
})