const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Post = require("./post");

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: String,
    birthday: Date,
    sex: String,
    country: String,
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
}) 
  
  module.exports = mongoose.model("User", UserSchema)