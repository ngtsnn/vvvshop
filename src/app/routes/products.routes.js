const router = require('express').Router();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


//import controller
const productController = require('../controllers/product.controller');



//routing for product routes
router.get('/:add', productController.add);
router.get('/', productController.index);




module.exports = router;