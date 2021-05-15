'use strict';

const mongoose = require("mongoose");
const { Schema } = mongoose;


const payment = new Schema({
  paymentId: { type: Schema.Types.ObjectId, ref: 'order'},
  userId: { type: Schema.Types.ObjectId, ref: 'user'},
  price: { type: Number, require: true },
}, {
  timestamps: true,
})

module.exports = mongoose.model("payment", payment); //collection: payments