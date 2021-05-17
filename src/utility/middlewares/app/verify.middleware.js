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

const isAdmin = async function (req, res, next){
  const token = req.header("auth_token");
  if(!token){
    res.status(401).send("action denined !!!");
  }

  
  try {
    const user = await jwt.verify(token, process.env.SECRET_KEY || "DevSecretKey");
    if (user.role != "admin" && user.role != "super admin"){
      res.status(401).send("action denined !!!");
      return;
    }
    req.user = user;
    next();
  } catch(err) {
    res.status(401).send("Fail to verify !!");
  }
} 



const isSuperAdmin = async function (req, res, next){
  const token = req.header("auth_token");
  if(!token){
    res.status(401).send("action denined !!!");
  }

  
  try {
    const user = await jwt.verify(token, process.env.SECRET_KEY || "DevSecretKey");
    if (user.role != "super admin"){
      res.status(401).send("action denined !!!");
      return;
    }
    req.user = user;
    next();
  } catch(err) {
    res.status(401).send("Fail to verify !!");
  }
} 
module.exports = { verify, isAdmin, isSuperAdmin };