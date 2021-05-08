'use strict';

const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const { Schema } = mongoose;

mongoose.plugin(slug);

const blog = new Schema({
  name: {type: String, default: '', require: true,},
  img: {type: String, require: true,},
  content: {type: String, default: '', require: true},
  slug: { type: String, slug: "name", unique: true },
}, {
  timestamps: true,
})

module.exports = mongoose.model("blog", blog); //collection: blogs