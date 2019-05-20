const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
require("babel-polyfill");
const reflections = require("./api/v1/reflections.js");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res
    .status(200)
    .send({ message: "YAY! Congratulations! Your first endpoint is working" });
});

// Use Routes
app.use("/api/v1/reflections", reflections);

const PORT = process.env.PORT;
app.listen(PORT);
console.log("app running on port ", PORT);

/*
We installed babel-polyfill npm package and imported it -
We need this here so that node runtime will recognise async/await and Promise.
*/
