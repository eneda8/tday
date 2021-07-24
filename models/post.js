const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");
const {getToday, getTimestamp} = require("../utils/getToday");


const ImageSchema = new Schema({
  path: String,
  filename: String
});

ImageSchema.virtual("thumbnail").get(function() {
  return this.path.replace("/upload", "/upload/w_200")
});

ImageSchema.virtual("fullsize").get(function() {
  return this.path.replace("/upload", "/upload/w_350")
});


const PostSchema = new Schema({
    date: {
      type: String,
      default: getToday()
    },
    timestamp: {
      type: String,
      default: getTimestamp()
    },
    rating: {
      type: Number,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    image: ImageSchema,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User"
      },
    comments: [
      {
      type: Schema.Types.ObjectId,
      ref: "Comment"
      }
    ],
    likes: {
      type: Number
    }
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
