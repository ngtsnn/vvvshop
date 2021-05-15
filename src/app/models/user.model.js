'use strict';

const mongoose = require("mongoose");
const { Schema } = mongoose;


const user = new Schema({
  email: { type: String, unique: true, required: true, trim: true, lowercase: true},
  phone: { type: String, unique: true, required: true},
  password: { type: String, required: true},
  firstName: { type: String, trim: true, require: true },
  lastName: { type: String, trim: true, require: true },
  address: { type: String, trim: true, require: true },
  avatar: { type: String },
  role: {
    type: String,
    default: 'USER',
    enum: ['USER', 'ADMIN', 'SUPER_ADMIN']
  },}, {
  timestamps: true,
})

module.exports = mongoose.model("user", user); //collection: users