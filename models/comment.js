const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema ({
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        autopopulate: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
    }
}, 
    {
    timestamps: true, 
    setDefaultsOnInsert: true
    } 
);

commentSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("Comment", commentSchema)

