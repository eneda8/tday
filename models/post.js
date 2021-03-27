const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const getToday = function() {
  const date = new Date() 
  const today = (date.getMonth() +1).toString().padStart(2, 0) + '/' + date.getDate().toString().padStart(2, 0) + "/" + date.getFullYear().toString()  
  return today;
}

const PostSchema = new Schema({
    date: {
      type: String,
      default: getToday()
    },
    author: {
      type:String,
      default: "author"
    },
      rating: {
      type: Number,
      required: true
    },
    body: String,
  },
  {timestamps: true, //Don't pass it in the schema itself, pass it as an option in constructor
  setDefaultsOnInsert: true
  } 
) 
  
  module.exports = mongoose.model("Post", PostSchema)
