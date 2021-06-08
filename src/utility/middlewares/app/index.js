"use strict";
const sliceURL =  require("./sliced_url.middleware");
const createNav =  require("./dynamic_nav.middleware");
const { enable_cors } = require("./enable_cors.middleware");


module.exports = [sliceURL, createNav, enable_cors];