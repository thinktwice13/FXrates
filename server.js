"use strict"

const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const SEED = require('./client/uploads/seed');
const Transaction = require('./models/transaction');

const app = express();

//DB config
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds135029.mlab.com:35029/tt13`);

app.set("port", (process.env.PORT || 3001));

//sreve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

//prevent CORS errors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.setHeader("Cache-Control", "no-cache");
  next();
});


//ROUTES
app.get("/", (req, res) => res.send("I'm home"));
app.get("/transactions/", (req, res) => {
  //seed data from /cleint/upload/seed.json
  // res.json(SEED);

  //seed from mlab
  Transaction.find((err, transaction) => {
    if (err) res.send(err);
    res.json(transaction);
  });
});
app.post("/uploads", (req, res) => {
  // let transaction = new Transaction();
  let transaction = new Transaction(req.body); //?????????
  transaction.save((err, tx) => {
    if (err) res.send(err);
    res.json({ message: "YAY"});
  })


  //TODO: server file upload
  //  const file = req.file;
  //  const meta = req.body;
  // axios.post({
  //   this.props.url + "/uploads",
  //   method = "post",
  //   data: {
  //     file,
  //     name: meta.name
  //   },
  // })
  // .then(response => res.status(200).json(response.data.data))
  // .catch((error) => res.status(500).json(error.response.data));
})

app.listen(app.get("port"), () => console.log("Server listening on port " + app.get("port") + "."));
