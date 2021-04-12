'use strict';

const mongoose = require("mongoose");
const { Schema } = mongoose;

const product = new Schema({
  name: {type: String, default: '', require: true,},
  img: {type: String, require: true,},
  description: {type: String, default: '', require: true},
  createdAt: {type: Date, default: Date.now, require: true},
  updatedAt: {type: Date, default: Date.now, require: true},
})

module.exports = mongoose.model("product", product); //collection: products