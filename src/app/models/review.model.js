'use strict';

const mongoose = require("mongoose");
const { Schema } = mongoose;


const rate = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'user', required: true, },
  rating: { type: Number, default: 0, min: 0, max: 5, required: true, },
  feeling: { type: String, default: '' },
}, { _id : false });

const review = new Schema({
  reviews: [rate],
  product: { type: mongoose.Types.ObjectId, ref: 'product', required: true, },
}, {
  timestamps: true,
});


module.exports = mongoose.model("review", review); //collection: reviews