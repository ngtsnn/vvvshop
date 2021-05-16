const mongoose = require("mongoose");
const { Schema } = mongoose;

const image = new Schema({
  url: { type: String, required: true, trim: true, default: ""},
  alt: { type: String, trim: true, default: ""}
});


module.exports = mongoose.model("image", image);