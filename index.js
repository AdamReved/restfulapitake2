const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const { urlencoded } = require("body-parser");
const router = require("./router/router");

mongoose
  .connect("mongodb://localhost:27017/rest")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error(err));

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(router);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
