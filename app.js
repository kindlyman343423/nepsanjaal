const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("Connected..."))
  .catch(err => {
    console.log("DB connection error");
  });

// middleware
app.use(morgan("dev"));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
