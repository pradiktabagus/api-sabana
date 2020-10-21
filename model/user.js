var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');
var UserSchema = mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    required: [true, "cant't be blank"],
    match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
    index: true,
    unique: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});



module.exports = mongoose.model("user", UserSchema);
