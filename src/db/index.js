const mongoose = require('mongoose');
const config = require('./config')

const conn = async () => {
  try {
    await mongoose.connect(`mongodb://127.0.0.1:12707/vvv_shop_dev`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("Connect to database successfully!!!!");
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {conn}