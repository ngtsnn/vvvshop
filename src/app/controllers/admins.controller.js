"use strict";
const User = require("../models/user.model");
const validator = require("validator");
const { ConvertObjects, ConvertObject } = require("../../utility/functions/mongoose");


const AdminController = function () {

}


// [GET] /admins
AdminController.prototype.index = async function (req, res, next) {
  try {
    let admins = await User.find({ role: { $in: ["admin", "super admin"] } }).select(["name", "avatar", "address", "phone", "email", "role"]);
    admins = ConvertObjects(admins);
    res.render("sites/admin/index", {
      admins,
    });
  } catch (error) {
    res.redirect("/500");
  }

}

// [GET] /admins/profile
AdminController.prototype.profile = async function (req, res, next) {
  const { id } = req.params;
  try {
    let admin = await User.findOne({ _id: id }).select(["name", "avatar", "address", "phone", "email", "role"]);
    admin = ConvertObject(admin);
    res.render("sites/admin/profile", {
      admin,
    });
  } catch (error) {
    res.redirect("/500");
  }

}




module.exports = new AdminController();

