"use strict"

const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Transaction = require('./models/transaction');

const app = express();

//DB config
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds135029.mlab.com:35029/tt13`);

//app confing
app.set("port", (process.env.PORT || 3001));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}
app.use(bodyParser.json());
//prevent CORS errors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.setHeader("Cache-Control", "no-cache");
  next();
});

//ROUTES
app.get("/", (req, res) => res.send("Hello"));
app.get("/transactions/", (req, res) => {
  Transaction.find((err, transaction) => {
    if (err) res.send(err);
    res.json(transaction);
  });
});
app.post("/uploads/", (req, res) => {
  //FIXME: rm forEach ---> batch insert !!
  req.body.forEach(item => {
    let transaction = new Transaction({
      currency: item.currency,
      amount: item.amount
    });
    transaction.save(err => {
      if (err) res.send(err);
    })
  })
  res.send("Transactions saved!");
})

app.listen(app.get("port"), () => console.log("Server listening on port " + app.get("port") + "."));
