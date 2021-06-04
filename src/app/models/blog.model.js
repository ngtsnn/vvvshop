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


const blog = new Schema({
  author: { type: mongoose.Types.ObjectId, ref: 'user', required: true, },
  name: { type: String, default: '', trim: true, required: true, },
  images: [{ type: String, default: '', required: true, }],
  paragraphs: [{ type: String, default: '', required: true }],
  slug: { type: String, slug: "name", unique: true },
}, {
  timestamps: true,
})


//for delete
blog.plugin(mongoose_delete, {
  deleteAt: true,
  deleteBy: true,
  overrideMethods: true,
});

module.exports = mongoose.model("blog", blog); //collection: blogs