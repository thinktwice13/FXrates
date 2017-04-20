"use strict"

const express = require('express');
const dotenv = require('dotenv').config();

const app = express();
const router = express.Router();
const SEED = require('./client/uploads/seed');

app.set("port", (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

//prevent errors from Cross Origin Sharing - set headers to allow CORS with middlware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.setHeader("Cache-Control", "no-cache");
  next();
});

app.get("/", (req, res) => res.send("I'm home"));
app.get("/transactions/", (req, res) => res.json(SEED));

app.listen(app.get("port"), () => console.log("Server listening on port " + app.get("port") + "."));
