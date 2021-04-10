const mongoose = require("mongoose");
const {Schema} = require("mongoose")


const product = new Schema({
  name: {type: String, default: '', require: true,},
  img: {type: String, require: true,},
  description: {type: String, default: '', require: true},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
})

module.exports = mongoose.model("product", product);