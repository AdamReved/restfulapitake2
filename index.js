const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require("mongoose");
const { urlencoded } = require("body-parser");
const user = require("./modules/user");
const bcrypt = require("bcrypt");
const User = require("./modules/user");
const _ = require("lodash");
const joi = require("joi");
const jsonwebtoken = require("jsonwebtoken");

mongoose
  .connect("mongodb://localhost:27017/rest")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error(err));

app.use(express.json());
app.use(urlencoded({ extended: true }));

// login page
app.get("/", (req, res) => {
  res.redirect("/login");
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "/login.html"));
});
// signup page
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "/signup.html"));
});

// login
app.post("/userLogin", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  res.send("ok!");
});
//email and password validation pre-server
function validate(req) {
  const schema = joi.object({
    email: joi.string().min(6).max(255).required().email(),
    password: joi.string().min(6).max(1024).required(),
  });

  return schema.validate(req);
}
// signup
app.post("/userSignup", async (req, res, next) => {
  const newUser = new user(req.body);
  //pre server signup validation - without unique email validation
  let error = newUser.validateSync();
  if (error) {
    res.send(error.errors);
  }
  //unique email validation
  else if (await user.findOne({ email: newUser.email })) {
    res.send(`user already exists`);
  } else {
    //hash and salt password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    //saving user
    await newUser.save();
    res.send(_.pick(newUser, ["_id", "fullName", "email"]));
  }
});

app.get("/allusers", async (req, res) => {
  const allUsers = await user.find({});
  res.send(allUsers);
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
