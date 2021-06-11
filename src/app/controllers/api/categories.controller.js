'use strict';

const validator = require("validator");
const Category = require("../../models/category.model");

const CategoryController = function () {

}

// [GET] /api/categories
// [GET] /api/categories?_filter&prop=value
CategoryController.prototype.get = async function (req, res, next) {

  let hasPagination = false, perPage, page;

  // on pagination
  if (req.query.hasOwnProperty("_paginate")) {
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
    let data = await Category.find(queryObj);
    if (hasPagination) {
      const totalPage = Math.ceil(data.length / perPage);
      const newData = await Category.find(queryObj).limit(perPage).skip(perPage * (page - 1));
      data = new Object();
      data["totalPage"] = totalPage;
      data["hasNextPage"] = page < totalPage;
      data["hasPrevPage"] = page > 1;
      data["data"] = newData;
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
  }
}

// [GET] /api/categories/:id
CategoryController.prototype.getOne = async function (req, res, next) {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"] });
    return;
  }

  try {
    const data = await Category.findOne({ _id: id });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
  }
}

// [POST] /api/categories
CategoryController.prototype.post = async function (req, res, next) {
  const newCategory = new Category(req.body);

  // validate
  let errs = [];

  // check name
  if (!newCategory.name || validator.isEmpty(newCategory.name)) {
    errs.push("Tên danh mục là trường bắt buộc");
  }

  // check parent
  if (newCategory.parent) {
    try {
      const parent = await Category.findOne({ tree: newCategory.parent });
      if (!parent) {
        errs.push("Danh mục cha không tồn tại");
      }
    } catch (error) {
      res.status(500).json({ errors: ["đã có lỗi xảy ra, vui lòng thử lại sau!"] });
      return;
    }
  }

  await newCategory.makeTree();

  // check duplicated
  try {
    const foundCategory = await Category.findOne({ tree: newCategory.tree });
    if (foundCategory) {
      errs.push("Danh mục này đã tồn tại!");
    }
  } catch (error) {
    res.status(500).json({ errors: ["đã có lỗi xảy ra, vui lòng thử lại sau!"] });
    return;
  }

  if (errs.length) {
    res.status(400).json({ errors: errs });
    return;
  }


  // add data
  try {
    const result = await newCategory.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ errors: ["đã có lỗi xảy ra, vui lòng thử lại sau!"] });
  }

}

// [PUT] /api/categories/:id
CategoryController.prototype.put = async function (req, res, next) {
  const newCategory = new Category(req.body);
  const { id } = req.params;

  // validate
  let errs = [];

  // check name
  if (!newCategory.name || validator.isEmpty(newCategory.name)) {
    errs.push("Tên danh mục là trường bắt buộc");
  }

  // check parent
  if (newCategory.parent) {
    try {
      const parent = await Category.findOne({ tree: newCategory.parent });
      if (!parent) {
        errs.push("Danh mục cha không tồn tại");
      }
    } catch (error) {
      res.status(500).json({ errors: ["đã có lỗi xảy ra, vui lòng thử lại sau!"] });
      return;
    }
  }

  await newCategory.makeTree();

  // check duplicated
  try {
    const foundCategory = await Category.findOne({ tree: newCategory.tree });
    if (foundCategory) {
      errs.push("Danh mục này đã tồn tại!");
    }
  } catch (error) {
    res.status(500).json({ errors: ["đã có lỗi xảy ra, vui lòng thử lại sau!"] });
    return;
  }

  if (errs.length) {
    res.status(400).json({ errors: errs });
    return;
  }


  // save data
  try {
    const cate = await Category.findOne({ _id: id });
    const children = await Category.find({ parent: cate.tree });
    if (children.length){
      for (let i = 0; i < children.length; i++){
        const child = children[i];
        child.parent = newCategory.tree;
        await child.makeTree();
        await child.save();
      }
    }
    cate.logo = newCategory.logo;
    cate.name = newCategory.name;
    cate.parent = newCategory.parent;
    cate.tree = newCategory.tree;
    const result = await cate.save();
    res.status(200).json({ message: "Chỉnh sửa danh mục thành công" });
  } catch (error) {
    res.status(500).json({ errors: ["đã có lỗi xảy ra, vui lòng thử lại sau!"] });
  }

}

module.exports = new CategoryController();