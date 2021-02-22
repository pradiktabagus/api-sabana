var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var secret = require("../config/index").secret;

var UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      required: [true, "cant't be blank"],
      index: true,
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
      unique: true,
    },
    bio: String,
    image: String,
    hash: String,
    salt: String,
  },
  { timestamps: true }
);

// UserSchema.plugin(uniqueValidator, { message: "is already taken" });

UserSchema.methods.validPassword = function (password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

UserSchema.methods.generateJWT = function () {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000),
    },
    secret
  );
};

UserSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    email: this.email,
    bio: this.bio,
    image: this.image,
    token: this.generateJWT(),
  };
};

UserSchema.methods.errorAuthJSON = function (error) {
  return {
    message: [error],
  };
};

UserSchema.methods.toProfileJSONFor = function (user) {
  return {
    username: this.username,
    bio: this.bio,
    image:
      this.image || "https://static.productionready.io/images/smiley-cyrus.jpg",
  };
};

module.exports = mongoose.model("User", UserSchema);
// mongoose.model("User", UserSchema);
