"use strict";
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const validator = require("validator");


const OrderController = function () {
  
}


// [GET] /api/orders
OrderController.prototype.get = async function (req, res, next) {
  
  let hasPagination = false, perPage, page;

  // on pagination
  if (req.query.hasOwnProperty("_paginate")){
    hasPagination = true;
    perPage = parseInt(req.query["perPage"]) || 8;
    page = parseInt(req.query["page"]) || 1;
    delete req.query["_paginate"];
    delete req.query["perPage"];
    delete req.query["page"];
  }
  
  // on filter
  let objQuery = new Object();
  if (req.query.hasOwnProperty("_filter")){
    objQuery = req.query;
    delete objQuery["_filter"];
  }

  // filter with role
  if (req.user.role !== "admin" && req.user.role !== "super admin"){
    objQuery.user = req.user._id;
  }

  try {
    let data = await Order.find(objQuery).populate({path: 'details.product', select: ['name', 'images']}).populate({path: "user", select: ["name", "avatar"]});
    if (hasPagination){
      const totalPage = Math.ceil(data.length / perPage);
      const newData = await Order.find(objQuery).populate({path: 'details.product', select: ['name', 'images']}).populate({path: "user", select: ["name", "avatar"]}).limit(perPage).skip(perPage * (page - 1));
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

// [GET] /api/orders/:id
OrderController.prototype.getOne = async function (req, res, next) {
  const id = req.params.id;

  if (!id){
    res.status(400).json({errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"]});
    return;
  }

  const query = {
    _id: id,
  }
  // filter with role
  if (req.user.role !== "admin" && req.user.role !== "super admin"){
    query.user = req.user._id;
  } 
  console.log(query)

  try {
    const data = await Order.findOne(query).populate({path: 'details.product', select: ['name', 'images']}).populate({path: "user", select: ["name", "avatar"]});
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"]});
  }
}

// [POST] /api/orders
OrderController.prototype.post = async function (req, res, next) {
  const newOrder = new Order(req.body);



  // validate
  let errs = [];

  // check details[]
  newOrder.details.forEach((detail, index) => {
    try {
      const product = Product.findOne({_id: detail.product});
      if (!product){
        errs.push(`không tìm thấy sản phẩm thứ ${index + 1}`);
      }
      if (detail.quantity < 1){
        errs.push(`sản phẩm thứ ${index + 1} phải có số lượng ít nhất là 1`);
      }
    } catch (error) {
      res.status(500).json({errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"]});
      return;
    }
  });

  // check phone
  const VNPhoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  if (!VNPhoneRegex.test(newOrder.deliver.phone)){
    errs.push("số điện thoại có định dạng sai");
  }
  // check address
  if(!newOrder.deliver.address || validator.isEmpty(newOrder.deliver.address)){
    errs.push("địa chỉ giao hàng là trường bắt buộc!");
  }
  // force deliver status is delivering
  newOrder.deliver.status = "delivering";

  // check payment method
  if(newOrder.payment.method !== "paypal" && newOrder.payment.method !== "cash"){
    errs.push("phương thức thanh toán chưa chính xác!");
  }

  // get user id
  newOrder.user = req.user._id;

  if (errs.length){
    res.status(400).json({errors: errs});
    return;
  }

  try {
    const result = await newOrder.save();
    res.status(200);
    res.json(result);
  } catch (error) {
    res.status(500).json({errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"]});
  }
}



module.exports = new OrderController();

