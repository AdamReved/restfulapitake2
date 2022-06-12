const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

// login page
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// login
app.get("/user", (req, res) => {
  res.send("Hello World!");
});
// signup
app.post("/user", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/test")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));
