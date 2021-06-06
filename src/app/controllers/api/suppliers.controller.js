'use strict';

const validator = require("validator");
const Supplier = require("../../models/supplier.model");

const SupplierController = function () {

}

// [GET] /api/suppliers
// [GET] /api/suppliers?_filter&prop=value
SupplierController.prototype.get = async function (req, res, next) {

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

  // for filter
  let queryObj = new Object();
  if (req.query.hasOwnProperty("_filter")) {
    queryObj = req.query;
    delete queryObj["_filter"];
  }

  try {
    let data = await Supplier.find(queryObj);
    if (hasPagination){
      const totalPage = Math.ceil(data.length / perPage);
      const newData = await Supplier.find(queryObj).limit(perPage).skip(perPage * (page - 1));
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

SupplierController.prototype.getOne = async function (req, res, next) {
  const id = req.params.id;

  if (!id){
    res.status(400).json({errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"]});
    return;
  }

  try {
    const data = await Supplier.findOne({_id: id});
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"]});
  }
}

// [POST] /api/suppliers
SupplierController.prototype.post = async function (req, res, next) {
  const newSupplier = new Supplier(req.body);

  // validate
  let errs = [];

  // check name
  if(!newSupplier.name || validator.isEmpty(newSupplier.name)){
    errs.push("Tên nhà cung cấp là trường bắt buộc");
  }

  // check avatar
  if (!newSupplier.image || validator.isEmpty(newSupplier.image) ||!validator.isURL(newSupplier.image, {
    require_protocol: true,
    require_valid_protocol: true,
    allow_underscores: true,
  })){
    errs.push("logo không đúng định dạng");
  }

  try {
    const foundSupplier = await Supplier.findOne({name: newSupplier.name});
    if (foundSupplier){
      errs.push("nhà cung cấp đã tồn tại!");
    }
  } catch (error) {
    res.status(500).json({errors: ["đã có lỗi xảy ra, vui lòng thử lại sau!"]});
  }

  if (errs.length){
    res.status(400).json({errors: errs});
    return;
  }


  // add data
  try {
    const result = await newSupplier.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({errors: ["đã có lỗi xảy ra, vui lòng thử lại sau!"]});
  }

}

module.exports = new SupplierController();