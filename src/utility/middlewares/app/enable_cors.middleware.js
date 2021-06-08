"use strict";

const enable_cors = function(req, res, next){
  res.header('Access-Control-Allow-Headers', "*").header('Access-Control-Allow-Origin', "*").header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
  next();
}

module.exports = { enable_cors }