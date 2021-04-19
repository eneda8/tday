const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    birthday: {
        type: Date,
        required: true,
    },
    gender:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
}) 
  
userSchema.plugin(passportLocalMongoose, {
    selectFields : "birthday gender country"});

module.exports = mongoose.model("User", userSchema);