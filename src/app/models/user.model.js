'use strict';

const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const validator = require('validator')
const { Schema } = mongoose;

mongoose.plugin(slug);

const user = new Schema({
  userID: { type: String, default: '', trim: true, require: true},
  email: { type: String, unique: true, required: true, trim: true, lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
  phone: { type: String, unique: true, required: true, trim: true, lowercase: true,
    validate(value) {
      if (!validator.isMobilePhone(value)) {
        throw new Error('Phone is invalid')
      }
    }
  },
  password: { type: String, required: true, minlength: 7, trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password cannot contain "password"')
      }
    }
  },
  name: { type: String, default: '', trim: true, require: true, },
  adress: { type: String, default: '', trim: true, require: true, },
  avatar: { type: String, default: '', require: true, },
  role: { type: String, default: '', trim: true, require: true, },

  slug: { type: String, slug: "name", unique: true },
}, {
  timestamps: true,
})

module.exports = mongoose.model("user", user); //collection: users