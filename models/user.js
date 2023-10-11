// Import required modules and dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// Define the Avatar schema for representing avatar path and filename
const AvatarSchema = new Schema({
    path: {
        type: String,
        default: "https://res.cloudinary.com/dw3o86f8j/image/upload/v1634179812/t%27day/avatars/defaultAvatar2_qyqc9t.png",
        required: true
        
    },
    filename: {
        type: String,
        default: "t%27day/avatars/defaultAvatar2_qyqc9t.png",
        required: true
    }
});

// Define the Cover schema for representing cover photo path and filename
const  coverSchema = new Schema({
    path: String,
    filename: String
});

// Virtual getter to generate a profile image path from the cover photo path
coverSchema.virtual("profile").get(function(){
    return this.path.replace("/upload/w_400,h_400,c_fill")
})

// Virtual getter to generate a thumbnail image path from the avatar path
AvatarSchema.virtual("thumbnail").get(function() {
return this.path.replace("/upload", "/upload/w_40,h_40,c_thumb,c_fill,r_max")
})

// Virtual getter to generate a profile image path from the avatar path
AvatarSchema.virtual("profile").get(function() {
return this.path.replace("/upload", "/upload/w_400,h_400,c_fill")
})

// Define the User schema for representing user data
const UserSchema = new Schema({
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
    avatar: AvatarSchema, // Embed the Avatar schema for the avatar field
    // displayName: String,
    bio: String,
    coverColor: {
        type: String,
        default: "#343a40"
    },
    coverPhoto: coverSchema, // Embed the Cover schema for the coverPhoto field
    posts: [{ // Reference the Post model for the posts field
        type: Schema.Types.ObjectId,
        ref: "Post" 
    }],
    comments: [{ // Reference the Comment model for the comments field
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    journals: [{
        type: Schema.Types.ObjectId, // Reference the Journal model for the journals field
        ref: "Journal"
    }], 
    bookmarks: [{
        type: Schema.Types.ObjectId, // Reference the Post model for the bookmarks field
        ref: "Post" 
    }],
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
}, {timestamps: true}) // Add createdAt and updatedAt fields for tracking timestamps

// Apply the passportLocalMongoose plugin to the userSchema for authentication
UserSchema.plugin(passportLocalMongoose);

// Create the User mongoose model using the userSchema definition and export it
module.exports = mongoose.model("User", UserSchema);