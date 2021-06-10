"use strict";
const User = require("../../models/user.model");
const validator = require("validator");


const UserController = function () {

}


// [GET] /api/users
UserController.prototype.get = async function (req, res, next) {

  let hasPagination = false, perPage, page;

  // on pagination
  if (req.query.hasOwnProperty("_paginate")) {
    hasPagination = true;
    perPage = parseInt(req.query["perPage"]) || 8;
    page = parseInt(req.query["page"]) || 1;
    delete req.query["_paginate"];
    delete req.query["perPage"];
    delete req.query["page"];
  }

  // on filter
  let objQuery = new Object();
  if (req.query.hasOwnProperty("_filter")) {
    objQuery = req.query;
    delete objQuery["_filter"];
  }


  // filter with role
  if (req.user.role !== "admin" && req.user.role !== "super admin") {
    objQuery._id = req.user._id;
  }

  try {
    let data = await User.find(objQuery).select(["name", "avatar", "address", "email", "phone"]);
    if (hasPagination) {
      const totalPage = Math.ceil(data.length / perPage);
      const newData = await User.find(objQuery).select(["name", "avatar", "address", "email", "phone"]).limit(perPage).skip(perPage * (page - 1));
      data = new Object();
      data["totalPage"] = totalPage;
      data["hasNextPage"] = page < totalPage;
      data["hasPrevPage"] = page > 1;
      data["data"] = newData;
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
  }
}

// [GET] /api/users/:id
UserController.prototype.getOne = async function (req, res, next) {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"] });
    return;
  }

  // role
  if (req.user.role !== "admin" && req.user.role !== "super admin" && id !== req.user._id) {
    res.status(401).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
    return;
  }

  try {
    const data = await User.findOne({ _id: id }).select(["name", "avatar", "address", "email", "phone"]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
  }
}

// [PUT] /api/users/:id
UserController.prototype.put = async function (req, res, next) {
  const updatedUser = new User(req.body);
  const id = req.params.id;

  if (req.user._id !== id) {
    res.status(401).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
    return;
  }

  // validate
  let errs = [];

  // check is email
  if (!updatedUser.email || validator.isEmpty(updatedUser.email)) {
    errs.push("email là trường bắt buộc!");
  }
  if (!updatedUser.email || !validator.isEmail(updatedUser.email)) {
    errs.push("email có định dạng sai!");
  }
  // check phone
  const VNPhoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  if (!VNPhoneRegex.test(updatedUser.phone)) {
    errs.push("số điện thoại có định dạng sai");
  }
  // check name
  if (!updatedUser.name || validator.isEmpty(updatedUser.name)) {
    errs.push("tên là trường bắt buộc!");
  }

  // check email and phone number is register or not
  const oldEmailUser = await User.findOne({ email: updatedUser.email, _id: { $ne: id } });
  const oldTelUser = await User.findOne({ phone: updatedUser.phone, _id: { $ne: id } });
  if (oldEmailUser) {
    errs.push("email này đã được đăng kí!");
  }
  if (oldTelUser) {
    errs.push("số điện thoại này đã được đăng kí!");
  }


  if (errs.length) {
    res.status(400).json({ errors: errs });
    return;
  }

  try {
    let user = await User.findOne({ _id: id });
    user.name = updatedUser.name;
    user.avatar = updatedUser.avatar;
    user.email = updatedUser.email;
    user.phone = updatedUser.phone;
    user.address = updatedUser.address;
    const result = await user.save();

    res.status(200).json({
      address: result.address,
      avatar: result.avatar,
      email: result.email,
      name: result.name,
      phone: result.phone,
    });
  } catch (error) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
  }
}



module.exports = new UserController();

