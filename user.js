const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "No name"],
  },
  email: {
    type: String,
    required: [true, "No email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "No password"],
  },
  type: {
    type: String,
    enum: ["business", "private"],
  },
});

const User = mongoose.model("user", userSchema);
module.exports = User;
