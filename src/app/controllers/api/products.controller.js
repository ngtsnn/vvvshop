"use strict";
const Product = require("../../models/product.model");


const ProductController = function () {
  
}


// [GET] /api/products
ProductController.prototype.get = async function (req, res, next) {
  try {
    const products = await Product.find({});
    res.status(200);
    res.json(products);
  } catch (error) {
    res.status(400);
    next(error);
  }
}

// [POST] /api/products
ProductController.prototype.post = async function (req, res, next) {
  try {
    const newProduct = new Product(req.body);
    const result = await newProduct.save();
    res.status(200);
    res.json(result);
  } catch (error) {
    res.status(400);
    next(error);
  }
}



module.exports = new ProductController()

