"use strict";

const jwt = require("jsonwebtoken");

const verify = async function (req, res, next) {
  const token = req.header("auth_token");
  if (!token) {
    res.status(401).send({ errors: ["Lỗi xác thực!!"] });
    return;
  }



  try {
    const user = await jwt.verify(token, process.env.SECRET_KEY || "DevSecretKey");
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ errors: ["Lỗi xác thực!!"] });
  }
}

const isAdmin = async function (req, res, next) {
  const token = req.header("auth_token");
  if (!token) {
    res.status(401).send({ errors: ["Lỗi xác thực!!"] });
    return;
  }


  try {
    const user = await jwt.verify(token, process.env.SECRET_KEY || "DevSecretKey");
    if (user.role != "admin" && user.role != "super admin") {
      res.status(401).send({ errors: ["Lỗi xác thực!!"] });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ errors: ["Lỗi xác thực!!"] });
  }
}



const isSuperAdmin = async function (req, res, next) {
  const token = req.header("auth_token");
  if (!token) {
    res.status(401).send({ errors: ["Lỗi xác thực!!"] });
    return;
  }


  try {
    const user = await jwt.verify(token, process.env.SECRET_KEY || "DevSecretKey");
    if (user.role != "super admin") {
      res.status(401).send({ errors: ["Lỗi xác thực!!"] });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ errors: ["Lỗi xác thực!!"] });
  }
}

const verifyInDashboard = async function (req, res, next) {
  const token = req.cookies.auth_token;
  if (!token) {
    res.redirect("/auth/login");
    return;
  }



  try {
    const user = await jwt.verify(token, process.env.SECRET_KEY || "DevSecretKey");
    if (user.role != "admin" && user.role != "super admin") {
      res.status(401).send({ errors: ["Tài khoản của bạn không có quyền truy cập trang web này!!"] });
      res.redirect("/auth/login");
    }
    req.user = user;
    res.locals.user = user;
    next();
  } catch (err) {
    res.redirect("/auth/login");
  }
}

const logout = function (req, res, next) {
  res.clearCookie('auth_token');
  next();
}

module.exports = { verify, isAdmin, isSuperAdmin, verifyInDashboard, logout };