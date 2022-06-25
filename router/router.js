const express = require("express");
const path = require("path");
const user = require("../modules/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const joi = require("joi");
const auth = require("../middleware/tokenAuth");

const router = express.Router();

// login page
router.get("/", (req, res) => {
  res.redirect("/login");
});
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../login.html"));
});
// signup page
router.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../signup.html"));
});

// login
router.post("/userLogin", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let attempt = await user.findOne({ email: req.body.email });
  if (!attempt) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, attempt.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");
  res.send("/user", { token: attempt.generateAuthToken() });
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
router.post("/userSignup", async (req, res, next) => {
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

router.get("/user", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

//just to see all users - for testing
// router.get("/allusers", async (req, res) => {
//   const allUsers = await user.find({});
//   res.send(allUsers);
// });

module.exports = router;
