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


const property = new Schema({
  isMutable: { type: Boolean, default: false, required: true, },
  key: { type: String, default: '', required: true, },
  values: [{
    value: {type: String, default: '', required: true,},
    image: {type: String, default: '', },
    mutationPrice: { type: Number, default:0, },
  }]
});

const product = new Schema({
  name: { type: String, default: '', trim: true, required: true, },
  images: [{ type: String, default: '', required: true, }],
  properties: [property],
  categories: [{ type: mongoose.Types.ObjectId, ref: 'category', }],
  supplier: { type: mongoose.Types.ObjectId, ref: 'supplier', },
  description: { type: String, default: '', trim: true, required: true },
  originalPrice: { type: Number, default: 0, required: true, min: 0 },
  slug: { type: String, slug: "name", unique: true },
}, {
  timestamps: true,
});


//for delete
product.plugin(mongoose_delete, {
  deleteAt: true,
  deleteBy: true,
  overrideMethods: true,
})

module.exports = mongoose.model("product", product); //collection: products