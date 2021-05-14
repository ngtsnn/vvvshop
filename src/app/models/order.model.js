'use strict';

const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const { Schema } = mongoose;

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
  date: { type: Date, default: Date.now, trim: true, require: true, },
  address: { type: String, default: '', trim: true, require: true, },
  price: { type: Number, require: true },
}, {
  timestamps: true,
})

module.exports = mongoose.model("order", order); //collection: orders