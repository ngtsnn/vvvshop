"use strict";

const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");


const AuthController = function(){
  
}

// [POST] /api/auth/login
AuthController.prototype.login = async function(req, res, next){

  const loggedUser = req.body;

  // validate
  let errs = [];

  if(!loggedUser.account && !loggedUser.password){
    errs.push("very bad request!!");
  }


  // check find user or not
  const foundUser = await User.findOne({
    $or: [
      {
        email: loggedUser.account,
      },
      {
        phone: loggedUser.account,
      },
    ]
  });
  if (!foundUser){
    res.status(400).json({errors: ["tài khoản hoặc mật khẩu không chính xác!"]});
    return;
  }

  // check password
  if (!foundUser.compare(loggedUser.password)){
    errs.push("tài khoản hoặc mật khẩu không chính xác!");
  }

  if (errs.length){
    res.status(400).json({errors: errs});
    return;
  }

  // create token
  const token = jwt.sign({
    _id: foundUser._id,
    role: foundUser.role,
    name: foundUser.name,
    avatar: foundUser.avatar,
  }, process.env.SECRET_KEY || "DevSecretKey", { expiresIn: '1d' });

  res.header("auth_token", token).status(200).json({"auth_token": token});
  

}

// [POST] /api/auth/register
AuthController.prototype.register = async function(req, res, next){
  
  const newUser = new User(req.body);

  // validate
  let errs = [];

  // check is email
  if(!newUser.email || validator.isEmpty(newUser.email)){
    errs.push("email là trường bắt buộc!");
  }
  if(!newUser.email || !validator.isEmail(newUser.email)){
    errs.push("email có định dạng sai!");
  }
  // check phone
  const VNPhoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  if (!VNPhoneRegex.test(newUser.phone)){
    errs.push("số điện thoại có định dạng sai");
  }
  // check password
  if (newUser.password){
    if (!validator.isStrongPassword(newUser.password, {
      minLength: 8, 
      minLowercase: 0, 
      minUppercase: 0, 
      minNumbers: 0, 
      minSymbols: 0, 
    })){
      errs.push("mật khẩu có ít nhất 8 kí tự");
    }
  }
  // check name
  if(!newUser.name || validator.isEmpty(newUser.name)){
    errs.push("tên là trường bắt buộc!");
  }
  // check url avatar
  if (newUser.avatar){
    if (!validator.isURL(newUser.avatar, {
      require_protocol: true,
      require_valid_protocol: true,
      allow_underscores: true,
    })){
      errs.push("ảnh đại diện không đúng định dạng");
    }
  }
  // check role
  if(!validator.isIn(newUser.role, ["user", "admin", "super admin"])){
    errs.push(`không tồn tại vai trò "${newUser.role}"`);
  }
  
  // check email and phone number is register or not
  const oldEmailUser = await User.findOne({email: newUser.email});
  const oldTelUser = await User.findOne({phone: newUser.phone});
  if (oldEmailUser){
    errs.push("email này đã được đăng kí!");
  }
  if (oldTelUser){
    errs.push("số điện thoại này đã được đăng kí!");
  }



  // render errors if it has
  if (errs.length){
    res.status(400).json({errors: errs});
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

    res.header("auth_token", token).status(200).json({"auth_token": token});
  } 
  catch(err){
    res.status(500).json({errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"]});

  }
  
}

// [PATCH] /api/auth/reset/:id
AuthController.prototype.resetPassword = async function (req, res, next) { 
  const _id = req.params.id;
  const newPassword = req.body.password;


  // check request has password or not
  if (!newPassword){
    res.status(500).json({errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"]});
    return;
  }

  // validate password
  if (!validator.isStrongPassword(newPassword, {
    minLength: 8, 
    minLowercase: 0, 
    minUppercase: 0, 
    minNumbers: 0, 
    minSymbols: 0, 
  })){
    res.status(400).json({errors: ["mật khẩu phải có ít nhất 8 kí tự"]});
    return;
  }


  try {
    const user = await User.findOne({_id});
    if (!user){
      res.status(500).json({errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"]});
      return;
    }
    user.password = newPassword;
    user.encode();
    const result = await user.save();
    
    // create token
    const token = jwt.sign({
      _id: result._id,
      role: result.role,
      name: result.name,
      avatar: result.avatar,
    }, process.env.SECRET_KEY || "DevSecretKey", { expiresIn: '1d' });

    res.header("auth_token", token).status(200).json({"auth_token": token});
  } catch (error) {
    res.status(500).json({errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"]});
  }
}



module.exports = new AuthController();