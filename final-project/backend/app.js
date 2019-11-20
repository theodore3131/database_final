const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoute = require('./routes/posts');

const app = express();

mongoose.connect("<Your Cloud Cluster Connection String>")
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });



app.use(bodyParser.json());

// for Cross Origin Resource Sharing
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
})

app.use("/api/posts/", postRoute);

module.exports = app;
