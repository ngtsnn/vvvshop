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
    res.status(400).json({errors: ["account or password is not correct!"]});
    return;
  }

  // check password
  if (!foundUser.compare(loggedUser.password)){
    errs.push("account or password is not correct!");
  }

  if (errs.length){
    res.status(400).json({errors: errs});
    return;
  }

  // hide user
  foundUser.password = "";

  // create token
  const token = jwt.sign({
    _id: foundUser._id,
    role: foundUser.role,
  }, process.env.SECRET_KEY || "DevSecretKey", { expiresIn: '1d' });
  res.header("auth_token", token).header('Access-Control-Allow-Headers', "*").header('Access-Control-Allow-Origin', "*").status(200).json(foundUser);
  

}

// [POST] /api/auth/register
AuthController.prototype.register = async function(req, res, next){
  
  const newUser = new User(req.body);

  // validate
  let errs = [];

  // check is email
  if(!newUser.email || validator.isEmpty(newUser.email)){
    errs.push("email can not be empty!");
  }
  if(!newUser.email || !validator.isEmail(newUser.email)){
    errs.push("email has wrong format!");
  }
  // check phone
  const VNPhoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  if (!VNPhoneRegex.test(newUser.phone)){
    errs.push("phone has wrong format");
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
      errs.push("password must be at least 8 characters");
    }
  }
  // check name
  if(!newUser.name || validator.isEmpty(newUser.name)){
    errs.push("name can not be empty!");
  }
  // check url avatar
  if (newUser.avatar){
    if (!validator.isURL(newUser.avatar, {
      require_protocol: true,
      require_valid_protocol: true,
      allow_underscores: true,
    })){
      errs.push("your avatar is not a valid image");
    }
  }
  // check role
  if(!validator.isIn(newUser.role, ["user", "admin", "super admin"])){
    errs.push(`there is no role ${newUser.role}`);
  }
  
  // check email and phone number is register or not
  const oldEmailUser = await User.findOne({email: newUser.email});
  const oldTelUser = await User.findOne({phone: newUser.phone});
  if (oldEmailUser){
    errs.push("this email used to be register!");
  }
  if (oldTelUser){
    errs.push("this phone number used to be register!");
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

    // hide password
    newUser.password = "";

    // create token
    const token = jwt.sign({
      _id: result._id,
      role: result.role,
    }, process.env.SECRET_KEY || "DevSecretKey", { expiresIn: '1d' });
    res.header("auth_token", token).header('Access-Control-Allow-Headers', "*").header('Access-Control-Allow-Origin', "*").status(200).json(result);
  } 
  catch(err){
    res.status(400).json(err._message);
    next(err);

  }
  
}

// [PATCH] /api/auth/reset/:id
AuthController.prototype.resetPassword = async function (req, res, next) { 
  const _id = req.params.id;
  const newPassword = req.body.password;


  // check request has password or not
  if (!newPassword){
    res.status(400).send("Somethings go wrong, please try later!");
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
    res.status(400).send("password must be at least 8 characters");
    return;
  }


  try {
    const user = await User.findOne({_id});
    if (!user){
      res.status(400).send("Somethings go wrong, please try later!");
    }
    user.password = newPassword;
    user.encode();
    const result = await user.save();
    user.password = "";
    res.status(200).json(user);
  } catch (error) {
    res.status(400).send("Somethings go wrong, please try later!");
  }
}



module.exports = new AuthController();