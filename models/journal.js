const mongoose = require("mongoose");
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;
const Schema = mongoose.Schema;
const User = require("./user");
const {getToday, getTimestamp} = require("../utils/getToday");

const JournalSchema = new Schema({
    date: {
      type: String,
      default: getTimestamp()
    },
    body: {
      type: String,
      required: false
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User"
      },
    edited: Boolean,
    editedTime: {
      type: String,
      default: this.updatedAt
    }
  },
  //options
  {timestamps: true,
  setDefaultsOnInsert: true,
  } 
) 



JournalSchema.plugin(mongooseFieldEncryption, { fields: ["body"], secret: "some secret key" });


module.exports = mongoose.model("Journal", JournalSchema)
