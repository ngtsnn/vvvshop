'use strict';

const validator = require("validator");
const Supplier = require("../../models/supplier.model");

const SupplierController = function () {

}

// [GET] /api/suppliers
// [GET] /api/suppliers?_filter&prop=value
SupplierController.prototype.get = async function (req, res, next) {
  // for filter
  let queryObj = new Object();
  if (req.query.hasOwnProperty("_filter")) {
    queryObj = req.query;
    delete queryObj["_filter"];
  }

  try {
    const data = await Supplier.find(queryObj);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"] });
    next(error);
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
    res.status(400).json({errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"]});
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