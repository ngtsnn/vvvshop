'use strict';

const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const { Schema } = mongoose;

mongoose.plugin(slug);

const comment = new Schema({
  userId: {type: String, default: '', require: true,},
  comment: {type: String, require: true,},
  reply: {type: String},
}, {
  timestamps: true,
})

module.exports = mongoose.model("comment", comment); //collection: comments