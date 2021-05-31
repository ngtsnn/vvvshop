'use strict';

const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { Schema } = mongoose;


const reply_comment = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'user', required: true, },
  comment: { type: String, required: true, trim: true, },
}, {
  timestamps: true,
});


//for delete
product.plugin(mongoose_delete, {
  deleteAt: true,
  deleteBy: true,
  overrideMethods: true,
});

module.exports = mongoose.model("reply_comment", reply_comment); //collection: reply-comments