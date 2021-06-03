"use strict";
const Product = require("../../models/product.model");
const Category = require("../../models/category.model");
const Supplier = require("../../models/supplier.model")
const validator = require("validator");


const ProductController = function () {
  
}


// [GET] /api/products
ProductController.prototype.get = async function (req, res, next) {
  
  let categories, supplier, hasPagination = false, perPage, page;

  // on pagination
  if (req.query.hasOwnProperty("_paginate")){
    hasPagination = true;
    perPage = req.query["perPage"] || 8;
    page = req.query["page"] || 1;
    delete req.query["_paginate"];
    delete req.query["perPage"];
    delete req.query["page"];
  }
  
  // on filter
  let objQuery = new Object();
  if (req.query.hasOwnProperty("_filter")){
    objQuery = req.query;
    delete objQuery["_filter"];
    console.log(objQuery)
  }

  

  try {
    let data = await Product.find(objQuery).populate(['supplier', 'categories']);
    if (hasPagination){
      const totalPage = Math.ceil(data.length / perPage);
      const newData = await Product.find(objQuery).populate(['supplier', 'categories']).limit(perPage).skip(perPage * (page - 1));
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

// [GET] /api/products/:id
ProductController.prototype.getOne = async function (req, res, next) {
  const id = req.params.id;

  if (!id){
    res.status(400).json({errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"]});
    return;
  }

  try {
    const data = await Product.findOne({_id: id}).populate(['supplier', 'categories']);
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

  // check images[]
  newProduct.images.forEach((img, index) => {
    if (!validator.isURL(img, {
      require_protocol: true,
      require_valid_protocol: true,
      allow_underscores: true,
    })){
      errs.push(`ảnh thứ ${index + 1} không đúng định dạng`);
    }
  });

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

          if(val.image){
            if (!validator.isURL(val.image, {
              require_protocol: true,
              require_valid_protocol: true,
              allow_underscores: true,
            })){
              errs.push(`ảnh của thuộc tính không đúng định dạng`);
            }
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
    next(error)
  }
}



module.exports = new ProductController();

