'use strict';

const mongoose = require("mongoose");
const { Schema } = mongoose;

mongoose.plugin(slug);

const review = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user', default: null},
  productID: { type: Schema.Types.ObjectId, ref: 'product', default: null},
  rate: { type: Number, default: 0 }
}, {
  timestamps: true,
})

module.exports = mongoose.model("review", review); //collection: reviews