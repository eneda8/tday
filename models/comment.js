const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema ({
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    }
}, 
    {
    timestamps: true, 
    setDefaultsOnInsert: true
    } 
);

module.exports = mongoose.model("Comment", commentSchema)