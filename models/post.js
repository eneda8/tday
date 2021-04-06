const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const getToday = function() {
  const date = new Date() 
  const today = (date.getMonth() +1).toString()+ '/' + date.getDate().toString()+ "/" + date.getFullYear().toString().slice(2)  
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
    body: {
      type: String,
      required: true
    }
  },
  {timestamps: true, //Don't pass it in the schema itself, pass it as an option in constructor
  setDefaultsOnInsert: true
  } 
) 
  
  module.exports = mongoose.model("Post", PostSchema)
