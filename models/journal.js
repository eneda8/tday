const mongoose = require("mongoose");
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;
const Schema = mongoose.Schema;
const User = require("./user");

// Define the schema for the Journal model
const JournalSchema = new Schema({
    date: String,
    title: String,
    body: {
      type: String,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId, // Reference the User model for the author field
      ref: "User"
    },
    edited: Boolean,
  },
  //options
  {timestamps: true,
  setDefaultsOnInsert: true,
  } 
) 

// Plugin to encrypt the "body" and "title" fields of the journal entry
JournalSchema.plugin(mongooseFieldEncryption, { 
  fields: ["body", "title"], 
  secret: `${process.env.JOURNAL_SECRET}` 
});

module.exports = mongoose.model("Journal", JournalSchema)
