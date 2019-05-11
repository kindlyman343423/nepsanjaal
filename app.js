const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
require("express-async-errors")
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("Connected..."))
  .catch(err => {
    console.log("DB connection error", err);
  });

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(expressValidator());
app.use("/", require("./routes/post"));
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/user"));

app.use("*", (req, res)=>{
  res.status(404).json({error: "No route found"})
})

// Error handling middleware
app.use(function(err, req, res, next) {
  console.log(err)
  res.status(500).send("Something failed...");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
