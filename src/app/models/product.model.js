'use strict';

const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const slug = require("mongoose-slug-generator");
const { Schema } = mongoose;
const imageSchema = require("./image.model").schema;

//for slug generater
mongoose.plugin(slug, {
  separator: "-",
  lang: "en",
  truncate: 120
});

const product = new Schema({
  name: {type: String, default: '', trim: true, required: true,},
  images: [imageSchema],
  properties: { type: Map, trim: true},
  description: {type: String, default: '', trim: true, required: true},
  price: {type: Number, required: true,},
  slug: { type: String, slug: "name", unique: true },
}, {
  timestamps: true,
})

//for delete
product.plugin(mongoose_delete, {
  deleteAt: true,
  deleteBy: true,
  overrideMethods: true,
})

module.exports = mongoose.model("product", product); //collection: products