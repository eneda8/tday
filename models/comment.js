const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const commentSchema = new Schema ({
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    timestamp: Date,
}, 
    {
    timestamps: true, 
    setDefaultsOnInsert: true
    } 
);

module.exports = mongoose.model("Comment", commentSchema)