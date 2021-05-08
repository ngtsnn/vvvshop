"use strict";
const sliceURL =  require("./sliced_url.middleware");
const createNav =  require("./dynamic_nav.middleware");

module.exports = [sliceURL, createNav];