const mongoose = require("mongoose");
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;
const Schema = mongoose.Schema;
const User = require("./user");

const JournalSchema = new Schema({
    date: String,
    title: String,
    body: {
      type: String,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User"
      },
    edited: Boolean,
  },
  //options
  {timestamps: true,
  setDefaultsOnInsert: true,
  } 
) 



JournalSchema.plugin(mongooseFieldEncryption, { fields: ["body", "title"], secret: `${process.env.JOURNAL_SECRET}` });


module.exports = mongoose.model("Journal", JournalSchema)
