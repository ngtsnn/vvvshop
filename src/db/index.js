'use strict';

const mongoose = require('mongoose');
const config = require('./config')

const conn = async () => {
  try {
    await mongoose.connect(`mongodb://${config.host}:${config.db_port}/${config.db_name}`, {
      useNewUrlParser: true, 
      useUnifiedTopology: true
    });
    console.log("Connect to database successfully!!!!");
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {conn}