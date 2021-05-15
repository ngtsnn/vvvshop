'use strict';

const mongoose = require("mongoose");
const { Schema } = mongoose;

mongoose.plugin(slug);

const comment = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user', default: null},
  comment: {type: String, require: true,},
  reply: { type: String },
}, {
  timestamps: true,
})

module.exports = mongoose.model("comment", comment); //collection: comments