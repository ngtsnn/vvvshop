'use strict';

const Product = require("../models/product.model");

const ProductController = function () { 

}

// [GET] /products
ProductController.prototype.index = function(req, res, next){
  Product.find({}).then(products => {
    console.log(products);
    res.render("sites/products/dashboard", {products});
  })
  .catch(err => console.log(err.message))

}

// [GET] /products/add
ProductController.prototype.add = function(req, res, next){
  res.render('sites/products/add_product');
}

module.exports = new ProductController();