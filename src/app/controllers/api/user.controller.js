"use strict";

const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");


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


// [POST] /api/users/admin
UserController.prototype.addAdmin = async function (req, res, next) {

  const newUser = new User(req.body);

  // validate
  let errs = [];

  // check is email
  if (!newUser.email || validator.isEmpty(newUser.email)) {
    errs.push("email là trường bắt buộc!");
  }
  if (!newUser.email || !validator.isEmail(newUser.email)) {
    errs.push("email có định dạng sai!");
  }
  // check phone
  const VNPhoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  if (!VNPhoneRegex.test(newUser.phone)) {
    errs.push("số điện thoại có định dạng sai");
  }
  // add default password
  newUser.password = process.env.DEFAULT_PASSWORD || "adminvvvshop";
  // check name
  if (!newUser.name || validator.isEmpty(newUser.name)) {
    errs.push("tên là trường bắt buộc!");
  }

  // force role is admin
  newUser.role = "admin";

  // check first user
  try {
    const firstSuperAdmin = await User.findOne({ role: "super admin" });
    if (!firstSuperAdmin) {
      newUser.role = "super admin";
    }
  } catch (error) {
    newUser.role = "admin";
  }


  // check email and phone number is register or not
  const oldEmailUser = await User.findOne({ email: newUser.email });
  const oldTelUser = await User.findOne({ phone: newUser.phone });
  if (oldEmailUser) {
    errs.push("email này đã được đăng kí!");
  }
  if (oldTelUser) {
    errs.push("số điện thoại này đã được đăng kí!");
  }



  // render errors if it has
  if (errs.length) {
    res.status(400).json({ errors: errs });
    return;
  }


  // hash password
  newUser.encode();


  // create new user
  try {
    const result = await newUser.save();

    // create token
    const token = jwt.sign({
      _id: result._id,
      role: result.role,
      name: result.name,
      avatar: result.avatar,
    }, process.env.SECRET_KEY || "DevSecretKey", { expiresIn: '1d' });

    res.header("auth_token", token).status(200).json({ "auth_token": token });
  }
  catch (err) {
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

// [PATCH] /api/users/to-user/:id
UserController.prototype.toUser = async function (req, res, next) {
  const _id = req.params.id;


  if (!_id) {
    res.status(401).send({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!!"] });
    return;
  }


  try {
    const user = await User.findOne({ _id });

    if (user.role === "super admin") {
      res.status(401).send({ errors: ["super admin không thể bị hủy quyền"] });
      return;
    }

    if (!user) {
      res.status(400).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
      return;
    }
    user.role = "user";
    const result = await user.save();

    res.status(200).json({ message: "Hủy quyền admin thành công!"});
  } catch (error) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
  }
}



module.exports = new UserController();

