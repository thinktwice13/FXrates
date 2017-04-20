"use strict";

const mongoose = require('mongoose');

module.exports = mongoose.model("Transaction", new mongoose.Schema({
  currency: String,
  amount: String
}));
