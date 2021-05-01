const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const AvatarSchema = new Schema({
    path: {
        type: String,
        default: "/images/defaultAvatar.png"
    },
    filename: String,
  });
  
  AvatarSchema.virtual("thumbnail").get(function() {
    return this.path.replace("/upload"), "/upload/w_64"
  })
  

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    birthday: {
        type: Date,
        required: true,
    },
    gender:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    avatar: AvatarSchema,
    posts: [ 
        {
        type: Schema.Types.ObjectId,
        ref: "Post" 
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
}) 
  
userSchema.plugin(passportLocalMongoose, {
    selectFields : "birthday gender country avatar"});

module.exports = mongoose.model("User", userSchema);