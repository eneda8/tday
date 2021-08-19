const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {getTimestamp} = require("../utils/getToday");

const commentSchema = new Schema ({
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    timestamp: {
        type: String,
        default: getTimestamp()
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