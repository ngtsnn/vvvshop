"use strict";

const enable_cors = function(req, res, next){
  res.header('Access-Control-Allow-Headers', "*").header('Access-Control-Allow-Origin', "*");
  next();
}

module.exports = { enable_cors }