'use strict';

const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const mongoose_delete = require("mongoose-delete");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");

mongoose.plugin(slug);

const user = new Schema({
  email: { type: String, unique: true, required: true, trim: true, lowercase: true, },
  phone: { type: String, unique: true, required: true, trim: true, lowercase: true, },
  password: { type: String, minlength: 8, trim: true, },
  name: { type: String, default: '', trim: true, required: true, },
  address: { type: String, default: '', trim: true, },
  avatar: { type: String, default: '', },
  role: { type: String, default: 'user', enum: ["user", "admin", "super admin"], trim: true, required: true, },
}, {
  timestamps: true,
});

//for delete
user.plugin(mongoose_delete, {
  deleteAt: true,
  deleteBy: true,
  overrideMethods: true,
});

// custom functions
user.methods.encode = function(){
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
}

user.methods.compare = function(_password){
  // console.log(bcrypt.compareSync(_password, this.password));
  return bcrypt.compareSync(_password, this.password);
}


// custom query




module.exports = mongoose.model("user", user); //collection: users