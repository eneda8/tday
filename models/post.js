const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");
const {cloudinary} = require("../cloudinary");
const mongoosePaginate = require("mongoose-paginate");

// Define ImageSchema to store image data
const ImageSchema = new Schema({
  path: String,
  filename: String
});

// Define virtuals for thumbnail and fullsize images based on the image path
ImageSchema.virtual("thumbnail").get(function() {
  return this.path.replace("/upload", "/upload/w_200");
});

ImageSchema.virtual("fullsize").get(function() {
  return this.path.replace("/upload", "/upload/c_fill_pad,g_auto,w_800,h_800")
});

// Define PostSchema for Post model
const PostSchema = new Schema({
    date: {
      type: String,
    },
    rating: {
      type: Number,
      required: true
    },
    body: {
      type: String,
      required: false
    },
    image: ImageSchema,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      autopopulate: true
      },
    authorCountry: String,
    authorUsername: String,
    // authorDisplayName: String,
    authorGender: String,
    authorAgeGroup: String,
    authorID: String,
    comments: [{
      type: Schema.Types.ObjectId, //Reference the Comment model for the comments field
      ref: "Comment",
      autopopulate: true
    }],
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

// Plugin to automatically populate the "author" field when querying the Post model
PostSchema.plugin(require("mongoose-autopopulate"));

// Define a virtual for rating description based on the "rating" field
PostSchema.virtual("desc").get(function(){
  let desc;
  switch(this.rating){
    case 1: desc = "Terrible"; break;
    case 2: desc = "Not good"; break;
    case 3: desc = "Average"; break;
    case 4: desc = "Very good"; break;
    case 5: desc = "Amazing"; break;
  }
  return desc;
})

// Pre middleware function to remove the "__v" field from the update when using findByIdAndUpdate
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

// Plugin to add pagination support to the Post model
PostSchema.plugin(mongoosePaginate);

// Create the Post mongoose model using the PostSchema definition and export it
module.exports = mongoose.model("Post", PostSchema)
