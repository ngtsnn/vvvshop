const jwt = require("jsonwebtoken");

const AuthController = function () {

}

// [GET] /auth/login
AuthController.prototype.login = async function (req, res, next){
  res.status(200).render("sites/auth/login", {layout: "auth"});
}

// [GET] /auth/forgot
AuthController.prototype.forgot = async function (req, res, next){
  res.status(200).render("sites/auth/forgot", {layout: "auth"});
}

// [GET] /auth/reset/:token
AuthController.prototype.reset = async function (req, res, next){
  const token = req.params.token;
  const user = await jwt.decode(token);
  
  res.status(200).render("sites/auth/reset", {
    layout: "auth",
    token,
    _id: user._id,
  });
}


module.exports = new AuthController();