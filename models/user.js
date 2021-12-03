const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const AvatarSchema = new Schema({
    path: {
        type: String,
        default: "https://res.cloudinary.com/dw3o86f8j/image/upload/v1634179812/t'day/avatars/defaultAvatar_dhpfbw.png",
        required: true
        
    },
    filename: {
        type: String,
        default: "t'day/avatars/defaultAvatar_dhpfbw",
        required: true
    }
  });

  const  coverSchema = new Schema({
    path: String,
    filename: String
  });

  coverSchema.virtual("profile").get(function(){
      return this.path.replace("/upload/w_400,h_400,c_fill")
  })

  AvatarSchema.virtual("thumbnail").get(function() {
    return this.path.replace("/upload", "/upload/w_40,h_40,c_thumb,c_fill,r_max")
  })

  AvatarSchema.virtual("profile").get(function() {
    return this.path.replace("/upload", "/upload/w_400,h_400,c_fill")
  })


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    ageGroup: {
        type: String,
        required: true
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
            // default: "/images/flags/US.png"
        }
    },
    timezone: {
        type: String,
        // required: true
    },
    defaultTimezone: {
        type: String
    },
    avatar: AvatarSchema,
    displayName: String,
    bio: String,
    coverColor: {
        type: String,
        default: "#343a40"
    },
    coverPhoto: coverSchema,
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
    ],
    journals: [
        {
            type: Schema.Types.ObjectId,
            ref: "Journal"
        }
    ], 
    bookmarks: [ 
        {
        type: Schema.Types.ObjectId,
        ref: "Post" 
        }
    ],
    postedToday: {
        type: Boolean,
        default: false
    },
    todaysPost: {
        type: String
    },
    postStreak: {
        type: Number,
        default: 0
    },
    average: {
        type: Number,
        default: 0
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyEmailToken: String,
    verifyTokenExpires: Date,
    termsAgreement: {
        type: Boolean,
        default: false
    },
}, {timestamps: true}) 

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);