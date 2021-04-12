'use strict';

const Product = require("../models/product.model");

const ProductController = function () { 

}

// [GET] /products
ProductController.prototype.index = function(req, res, next){
  //sample get data
  Product.find({}).then(products => {
    //handle somethings before sending data to view
    products = products.map(product => product.toObject())

    //send data
    res.render("sites/products/dashboard", {products});
  })
  .catch(err => console.log(err.message))

}

// [GET] /products/add
ProductController.prototype.add = function(req, res, next){
  res.render('sites/products/add_product');
}

module.exports = new ProductController();