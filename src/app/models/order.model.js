'use strict';

const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const validator = require('validator')
const { Schema } = mongoose;

mongoose.plugin(slug);

const order = new Schema({
  orderID: { type: String, default: '', trim: true, require: true},
  userID: { type: String, default: '', trim: true, require: true},
  phone: { type: String, unique: true, required: true, trim: true, lowercase: true,
    validate(value) {
      if (!validator.isMobilePhone(value)) {
        throw new Error('Phone is invalid')
      }
    }
  },
  date: { type: String, default: '', trim: true, require: true, },
  adress: { type: String, default: '', trim: true, require: true, },
  price: { type: String, require: true },
  slug: { type: String, slug: "name", unique: true },
}, {
  timestamps: true,
})

module.exports = mongoose.model("order", order); //collection: orders