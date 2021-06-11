"use strict";
const User = require("../models/user.model");
const validator = require("validator");
const { ConvertObjects, ConvertObject } = require("../../utility/functions/mongoose");


const SettingController = function () {

}


// [GET] /admins
SettingController.prototype.index = async function (req, res, next) {
  try {
    let admin = await User.findOne({_id: req.user._id}).select(["avatar"]);
    admin = ConvertObject(admin);
    res.render("sites/setting/index", {
      admin,
    });
  } catch (error) {
    res.redirect("/500");
  }

}


module.exports = new SettingController();

