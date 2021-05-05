'use strict';

const mongoose = require('mongoose');
const config = require('./config');
const path = require("path");
require('dotenv').config({path: path.join(__dirname, "../env/.env.dev")});

const connectString = process.env.DB_CONNECT_STRING || "mongodb://localhost:27017/vvvshop-live-dev";

const conn = async () => {
  try {
    await mongoose.connect(connectString , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    console.log("Connect to database successfully!!!!");
    console.log(connectString);
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {conn}