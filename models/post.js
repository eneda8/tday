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
      required: true,

    },
    image: ImageSchema,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User"
      },
    comments: [
      {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      }
    ],
    likes: {
      type: Number
    },
    edited: Boolean
  },
  //options
  {timestamps: true,
  setDefaultsOnInsert: true,
  } 
) 

PostSchema.statics.random = async function(num) {
  let randomDocs = [];
  const today = getToday();
  for(let i =0; i<num; i++){
    const count = await this.countDocuments().where({ 'date': today });
    const rand = Math.floor(Math.random() * count);
    const randomDoc = await this.findOne({date: today}).skip(rand);
    randomDocs.push(randomDoc);
  }
  return randomDocs;
};

// PostSchema.post("findOneAndDelete", async function (doc) {
//   if(doc){
//     await Comment.deleteMany({
//       _id: {
//         $in: doc.comments
//       }
//     })
//   }
// })

PostSchema.pre('findByIdAndUpdate', function() {
  const update = this.getUpdate();
  if (update.__v != null) {
    delete update.__v;
  }
  const keys = ['$set', '$setOnInsert'];
  for (const key of keys) {
    if (update[key] != null && update[key].__v != null) {
      delete update[key].__v;
      if (Object.keys(update[key]).length === 0) {
        delete update[key];
      }
    }
  }
  update.$inc = update.$inc || {};
  update.$inc.__v = 1;
});

module.exports = mongoose.model("Post", PostSchema)
