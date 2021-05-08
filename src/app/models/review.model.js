'use strict';

const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const { Schema } = mongoose;

mongoose.plugin(slug);

const review = new Schema({
  userId: {type: String, default: '', require: true,},
  reviewID: {type: String, require: true,},
  productID: {type: String},
  slug: { type: String, slug: "name", unique: true },
}, {
  timestamps: true,
})

module.exports = mongoose.model("review", review); //collection: reviews