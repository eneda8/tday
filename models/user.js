const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const AvatarSchema = new Schema({
    path: {
        type: String,
        default: "https://res.cloudinary.com/dw3o86f8j/image/upload/v1620091559/todai/avatars/defaultAvatar_afhnfz.png",
        required: true
        
    },
    filename: {
        type: String,
        default: "todai/avatars/defaultAvatar_afhnfz",
        required: true
    }
  });
  
  AvatarSchema.virtual("thumbnail").get(function() {
    return this.path.replace("/upload", "/upload/w_40,h_40,c_thumb,c_fill,r_max")
  })

  AvatarSchema.virtual("profile").get(function() {
    return this.path.replace("/upload", "/upload/w_150,h_150,c_fill")
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
        name: {
            type: String,
            required: true
        },
        flag: {
            type: String,
            default: "/images/flags/US.png"
        }
    },
    avatar: AvatarSchema,
    displayName: String,
    bio: String,
    coverColor: {
        type: String,
        default: "#343a40"
    },
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

userSchema.statics.random = async function() {
    const count = await this.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const randomDoc = await this.findOne().skip(rand);
    return randomDoc;
  };

userSchema.plugin(passportLocalMongoose, {
    selectFields : "birthday gender country avatar"});

module.exports = mongoose.model("User", userSchema);