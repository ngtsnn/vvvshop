'use strict';

const validator = require("validator");
const Category = require("../../models/category.model");

const CategoryController = function () {

}

// [GET] /api/categories
// [GET] /api/categories?_filter&prop=value
CategoryController.prototype.get = async function (req, res, next) {
  // for filter
  let queryObj = new Object();
  if (req.query.hasOwnProperty("_filter")) {
    queryObj = req.query;
    delete queryObj["_filter"];
  }

  try {
    const data = await Category.find(queryObj);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"] });
    next(error);
  }
}

// [GET] /api/categories/:id
CategoryController.prototype.getOne = async function (req, res, next) {
  const id = req.params.id;

  if (!id){
    res.status(400).json({errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"]});
    return;
  }

  try {
    const data = await Category.findOne({_id: id});
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"]});
  }
}

// [POST] /api/categories
CategoryController.prototype.post = async function (req, res, next) {
  const newCategory = new Category(req.body);

  // validate
  let errs = [];

  // check name
  if(!newCategory.name || validator.isEmpty(newCategory.name)){
    errs.push("Tên danh mục là trường bắt buộc");
  }

  // check parent
  if(newCategory.parent){
    try {
      console.log(newCategory.parent);
      const parent = await Category.findOne({tree: newCategory.parent});
      console.log(parent);
      if (!parent){
        errs.push("Danh mục cha không tồn tại");
      }
    } catch (error) {
      res.status(500).json({errors: ["đã có lỗi xảy ra, vui lòng thử lại sau!"]});
      return;
    }
  }

  // check logo
  if (!newCategory.logo || validator.isEmpty(newCategory.logo) ||!validator.isURL(newCategory.logo, {
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

  newCategory.makeTree();

  // add data
  try {
    
    const result = await newCategory.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({errors: ["đã có lỗi xảy ra, vui lòng thử lại sau!"]});
    next(error);
  }

}

module.exports = new CategoryController();