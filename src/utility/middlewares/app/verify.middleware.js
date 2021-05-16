"use strict";

const jwt = require("jsonwebtoken");

const verify = async function (req, res, next){
  const token = req.header("auth_token");
  if(!token){
    res.status(401).send("denied action !!!");
  }


  
  try {
    const user = await jwt.verify(token, process.env.SECRET_KEY || "DevSecretKey");
    req.user = user;
    next();
  } catch(err) {
    res.status(401).send("Fail to verify !!");
  }
} 

module.exports = { verify };