const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the Comment model
const CommentSchema = new Schema ({
    body: String,
    author: {
        type: Schema.Types.ObjectId, // Reference the User model for the author field
        ref: "User",
        autopopulate: true
    },
    post: {
        type: Schema.Types.ObjectId, // Reference the Post model for the post field
        ref: "Post",
    }
}, 
    {
    timestamps: true, 
    setDefaultsOnInsert: true
    } 
);

CommentSchema.plugin(require("mongoose-autopopulate")); // Plugin to autopopulate the "author" field
module.exports = mongoose.model("Comment", CommentSchema)

