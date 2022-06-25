const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "No name"],
    match: [/^[a-zA-Z]{4,}(?: [a-zA-Z]+){0,2}$/, "please enter full name"],
  },
  email: {
    type: String,
    required: [true, "No email"],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "please enter valid email"],
  },
  password: {
    type: String,
    required: [true, "No password"],
    minlength: [6, "password 6 characters min"],
    maxlength: [20, "password 20 characters max"],
  },
  type: {
    type: String,
    required: [true],
    enum: ["business", "private"],
  },
  createdAt: { type: Date, default: Date.now },
});
userSchema.set("validateBeforeSave", false);
//instance method token generator
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get("jwtKey"));
  return token;
};

const User = mongoose.model("user", userSchema);
module.exports = User;
