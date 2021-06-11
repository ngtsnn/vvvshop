'use strict';

const mongoose = require('mongoose');
const path = require("path");
require('dotenv').config({path: path.join(__dirname, "../env/.env.staging")});

const connectString = process.env.DB_CONNECT_STRING || "mongodb://localhost:27017/vvvshop-live-dev";
// const connectString = process.env.DB_CONNECT_STRING || "mongodb+srv://admin:1234@cluster0.eo1f9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


const conn = async () => {
  try {
    await mongoose.connect(connectString , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    console.log("Connect to database successfully!!!!");
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {conn}