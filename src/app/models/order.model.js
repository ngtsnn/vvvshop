'use strict';

const mongoose = require("mongoose");
const { Schema } = mongoose;
const productSchema = require('./product.model')
const userSchema = require('./user.model')
const paymentSchema  = require('./payment.model')


const order = new Schema({
  product: [productSchema],
  user: [userSchema],
  payment: [paymentSchema],
  price: { type: Number, require: true },
}, {
  timestamps: true,
})

module.exports = mongoose.model("order", order); //collection: orders