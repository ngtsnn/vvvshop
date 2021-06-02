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


const supplier = new Schema({
  name: { type: String, default: '', trim: true, required: true, unique: true, },
  image: { type: String, default: '', required: true, },
  slug: { type: String, slug: "name", unique: true, },
}, {
  timestamps: true,
})


//for delete
supplier.plugin(mongoose_delete, {
  deleteAt: true,
  deleteBy: true,
  overrideMethods: true,
});

module.exports = mongoose.model("supplier", supplier); //collection: suppliers