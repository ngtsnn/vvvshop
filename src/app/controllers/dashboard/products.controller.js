"use strict";
const Product = require("../../models/product.model");
const Category = require("../../models/category.model");
const Supplier = require("../../models/supplier.model");
const validator = require("validator");
const {ConvertObjects, ConvertObject} = require("../../../utility/functions/mongoose");



const ProductController = function () {
  
}


// [GET] /dashboard/products
ProductController.prototype.index = async function (req, res, next) {

  try {
    let data = await Product.find({}).select(['name', 'originalPrice', 'slug']).populate({
      path: 'categories',
      select: 'tree',
    });
    const deletes = await Product.findDeleted({});
    

    data = ConvertObjects(data);
    
    res.status(200).render("sites/dashboard/products/index", {
      products: data,
      trashbinCount: deletes.length,
    });
  } catch (error) {
    res.status(500).redirect('/500');
  }
}

// [GET] /dashboard/products/trashbin
ProductController.prototype.trashbin = async function (req, res, next) {

  try {
    let data = await Product.findDeleted({}).select(['name', 'originalPrice', 'slug']).populate({
      path: 'categories',
      select: 'tree',
    });
    const publishes = await Product.find({});
    

    data = ConvertObjects(data);
    
    res.status(200).render("sites/dashboard/products/trashbin", {
      products: data,
      publishesCount: publishes.length,
    });
  } catch (error) {
    res.status(500).redirect('/500');
  }
}

// [GET] /dashboard/products/add
ProductController.prototype.add = async function (req, res, next) {

  try {
    let categories = await Category.find({}).select(['tree']);
    let suppliers = await Supplier.find({}).select(['name']);
    
    categories = ConvertObjects(categories);
    suppliers = ConvertObjects(suppliers);
    
    res.status(200).render("sites/dashboard/products/add", {
      suppliers,
      categories,
    });
  } catch (error) {
    res.status(500).redirect('/500');
  }
}

// [GET] /dashboard/products/edit
ProductController.prototype.edit = async function (req, res, next) {

  const {slug} = req.params;

  try {
    let product = await Product.findOne({slug});
    let categories = await Category.find({}).select(['tree']);
    let suppliers = await Supplier.find({}).select(['name']);
    
    categories = ConvertObjects(categories);
    suppliers = ConvertObjects(suppliers);
    product = ConvertObject(product);
    
    res.status(200).render("sites/dashboard/products/edit", {
      suppliers,
      categories,
      product,
    });
  } catch (error) {
    res.status(500).redirect('/500');
    next(error)
  }
}


module.exports = new ProductController();

