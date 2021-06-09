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

// [GET] /api/products/categories/:slug
// [GET] /api/products/categories/:slug?_paginate&page=num&perPage=num         : for only pagination
ProductController.prototype.getByCate = async function (req, res, next) {

  const slug = req.params[0];
  let hasPagination = false, perPage, page;

  // on pagination
  if (req.query.hasOwnProperty("_paginate")){
    hasPagination = true;
    perPage = parseInt(req.query["perPage"]) || 8;
    page = parseInt(req.query["page"]) || 1;
  }

  

  try {
    const category = await Category.findOne({slug});
    let data = await Product.find({categories: category._id}).populate(['supplier', 'categories']);
    if (hasPagination){
      const totalPage = Math.ceil(data.length / perPage);
      const newData = await Product.find({categories: category._id}).populate(['supplier', 'categories']).limit(perPage).skip(perPage * (page - 1));
      data = new Object();
      data["totalPage"] = totalPage;
      data["hasNextPage"] = page < totalPage;
      data["hasPrevPage"] = page > 1;
      data["data"] = newData;
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"]});
  }
}

// [GET] /api/products/supplier/:slug
// [GET] /api/products/supplier/:slug?_paginate&page=num&perPage=num         : for only pagination
ProductController.prototype.getBySupplier = async function (req, res, next) {

  const slug = req.params.slug;
  let hasPagination = false, perPage, page;

  // on pagination
  if (req.query.hasOwnProperty("_paginate")){
    hasPagination = true;
    perPage = parseInt(req.query["perPage"]) || 8;
    page = parseInt(req.query["page"]) || 1;
  }

  

  try {
    const supplier = await Supplier.findOne({slug});
    let data = await Product.find({supplier: supplier._id}).populate(['supplier', 'categories']);
    if (hasPagination){
      const totalPage = Math.ceil(data.length / perPage);
      const newData = await Product.find({supplier: supplier._id}).populate(['supplier', 'categories']).limit(perPage).skip(perPage * (page - 1));
      data = new Object();
      data["totalPage"] = totalPage;
      data["hasNextPage"] = page < totalPage;
      data["hasPrevPage"] = page > 1;
      data["data"] = newData;
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"]});
  }
}

// [POST] /api/products
ProductController.prototype.post = async function (req, res, next) {
  const newProduct = new Product(req.body);



  // validate
  let errs = [];

  // check name
  if(!newProduct.name || validator.isEmpty(newProduct.name)){
    errs.push("tên sản phẩm là trường bắt buộc!");
  }

  // check properties
  if (newProduct.properties && newProduct.properties.length){
    newProduct.properties.forEach((property, index) => {
      if(!property.key || validator.isEmpty(property.key)){
        errs.push("Vui lòng nhập tên thuộc tính!");
      }

      if(!property.values.length){
        errs.push("vui lòng nhập giá trị cho thuộc tính!");
      }
      else{
        property.values.forEach((val, i) => {
          if(!val.value || validator.isEmpty(val.value)){
            errs.push("vui lòng nhập giá trị cho thuộc tính!");
          }
        });
      }
    });
  }

  // check categories
  newProduct.categories.forEach((cate, index) => {
    try {
      const category = Category.findOne({_id: cate});
      if (!category){
        errs.push(`danh mục thứ ${index + 1} không tồn tại`);
      }
    } catch (error) {
      res.status(500).json({errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau!"]});
    }
  });

  // check supplier
  if (newProduct.supplier){    
    try {
      const supplier = Supplier.findOne({_id: newProduct.supplier})
      if(!supplier){
        errs.push("nhà cung cấp không tồn tại");
      }
    } catch (error) {
      res.status(500).json({errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau!"]});
    }
  }

  // check description
  if(!newProduct.description || validator.isEmpty(newProduct.description)){
    errs.push("mô tả là trường bắt buộc!");
  }

  // check original price
  if(!newProduct.originalPrice){
    errs.push("giá niêm yết là trường bắt buộc!");
  }



  try {
    const result = await newProduct.save();
    res.status(200);
    res.json(result);
  } catch (error) {
    res.status(500).json({errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"]});
  }
}



module.exports = new ProductController();

