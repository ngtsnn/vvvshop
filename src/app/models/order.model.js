'use strict';

const mongoose = require("mongoose");
const { Schema } = mongoose;
const productSchema = require('./product.model')
const userSchema = require('./user.model')
const paymentSchema  = require('./payment.model')


const detail = new Schema({
  product: { type: mongoose.Types.ObjectId, ref: 'product', required: true, },
  quantity: { type: Number, min: 0, required: true, },
});

const deliver = new Schema({
  phone: { type: String, default: '', required: true, trim: true, lowercase: true, },
  address: { type: String, default: '', trim: true, required: true, },
  status: {type: String, default: 'delivering', enum: ['delivering', 'delivered', 'refunding', 'refunded', 'canceled'], required: true, },
  delivery_notes: { type: String, default: '', },
});

const payment = new Schema({
  transaction_id: { type: String, default: '', trim: true, required: true, },
  method: {type: String, default: 'cash', enum: ['paypal', 'cash'], required: true, },
});

const order = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'user', required: true, },
  
  details: [detail],

  deliver: {type: deliver, required: true},

  payment: {type: payment, required: true},



}, {
  timestamps: true,
})

module.exports = mongoose.model("order", order); //collection: orders