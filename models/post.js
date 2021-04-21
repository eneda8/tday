const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");
const {getToday} = require("../utils/getToday");

const PostSchema = new Schema({
    date: {
      type: String,
      default: getToday()
    },
    rating: {
      type: Number,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    author: [
      {
      type: Schema.Types.ObjectId,
      ref: "User"
      }
    ],
    comments: [
      {
      type: Schema.Types.ObjectId,
      ref: "Comment"
      }
    ],
  },
  {timestamps: true, //Don't pass it in the schema itself, pass it as an option in constructor
  setDefaultsOnInsert: true
  } 
) 

// PostSchema.post("findOneAndDelete", async function (doc) {
//   if(doc){
//     await Comment.deleteMany({
//       _id: {
//         $in: doc.comments
//       }
//     })
//   }
// })

module.exports = mongoose.model("Post", PostSchema)
