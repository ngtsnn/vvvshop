const ProductController = function () { 

}

// [GET] /products
ProductController.prototype.index = function(req, res, next){
  res.render('sites/products/dashboard');
}

// [GET] /products/add
ProductController.prototype.add = function(req, res, next){
  res.render('sites/products/add_product');
}

module.exports = new ProductController();