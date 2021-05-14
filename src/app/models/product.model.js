'use strict';

const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const slug = require("mongoose-slug-generator");
const { Schema } = mongoose;

//for slug generater
mongoose.plugin(slug, {
  separator: "-",
  lang: "en",
  truncate: 120
});

const product = new Schema({
  name: {type: String, default: '', trim: true, require: true,},
  img: {type: String, require: true,},
  description: {type: String, default: '', trim: true, require: true},
  price: {type: Number, require: true,},
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