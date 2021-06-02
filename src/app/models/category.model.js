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


const category = new Schema({
  name: { type: String, default: 'uncategoried', required: true, trim: true, lowercase: true },
  parent: { type: String, default: '', trim: true },
  tree: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  logo: { type: String, default: '', },
  slug: {type: String, slug: "name", unique: true, }
}, {
  timestamps: true,
});


//for delete
category.plugin(mongoose_delete, {
  deleteAt: true,
  deleteBy: true,
  overrideMethods: true,
})

// methods
category.methods.makeTree = function(){
  this.tree = (this.parent ? this.parent + '/' : "") + this.name;
}

module.exports = mongoose.model("category", category); //collection: categories