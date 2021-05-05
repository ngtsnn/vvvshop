'use strict';

//dependencies
const router = require('express').Router();
const path = require('path');


const productsRoutes = require('./products.routes')

router.use('/products', productsRoutes);


module.exports = router;