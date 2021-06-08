'use strict';

const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { Schema } = mongoose;


const comment = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'user', required: true, },
  product: { type: mongoose.Types.ObjectId, ref: 'product', required: true, },
  comment: { type: String, required: true, trim: true, },
  reply: [{ type: mongoose.Types.ObjectId, ref: 'reply_comment', }],
}, {
  timestamps: true,
});


//for delete
product.plugin(mongoose_delete, {
  deleteAt: true,
  deleteBy: true,
  overrideMethods: true,
});

module.exports = mongoose.model("comment", comment); //collection: comments