"use strict";
const Blog = require("../../models/blog.model");
const User = require("../../models/user.model");
const validator = require("validator");


const BlogController = function () {
  
}


// [GET] /api/blogs
BlogController.prototype.get = async function (req, res, next) {
  
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

  

  try {
    let data = await Blog.find(objQuery).populate({path: 'author', select: ['name', 'avatar']});
    if (hasPagination){
      const totalPage = Math.ceil(data.length / perPage);
      const newData = await Blog.find(objQuery).populate({path: 'author', select: ['name', 'avatar']}).limit(perPage).skip(perPage * (page - 1));
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

// [GET] /api/blogs/:id
BlogController.prototype.getOne = async function (req, res, next) {
  const id = req.params.id;

  if (!id){
    res.status(400).json({errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"]});
    return;
  }

  try {
    const data = await Blog.findOne({_id: id}).populate({path: 'author', select: ['name', 'avatar']});
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"]});
  }
}

// [POST] /api/blogs
BlogController.prototype.post = async function (req, res, next) {
  const newBlog = new Blog(req.body);



  // validate
  let errs = [];

  // check name
  if(!newBlog.name || validator.isEmpty(newBlog.name)){
    errs.push("tên bài viết là trường bắt buộc!");
  }

  // check html
  if(!newBlog.html || validator.isEmpty(newBlog.html)){
    errs.push("nội dung bài viết là trường bắt buộc!");
  }

  if (errs.length){
    res.status(400).json({errors: errs});
    return;
  }

  // save as author
  newBlog.author = req.user._id;

  try {
    const result = await newBlog.save();
    res.status(200);
    res.json(result);
  } catch (error) {
    res.status(500).json({errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"]});
  }
}

// [POST] /api/blogs
BlogController.prototype.put = async function (req, res, next) {
  const newBlog = new Blog(req.body);
  const id = req.params.id;
  // validate
  let errs = [];

  // check name
  if(!newBlog.name || validator.isEmpty(newBlog.name)){
    errs.push("tên bài viết là trường bắt buộc!");
  }

  // check html
  if(!newBlog.html || validator.isEmpty(newBlog.html)){
    errs.push("nội dung bài viết là trường bắt buộc!");
  }

  if (errs.length){
    res.status(400).json({errors: errs});
    return;
  }

  // save as author
  newBlog.author = req.user._id;

  try {
    let oldBlog = await Blog.findOne({_id: id});
    oldBlog.name = newBlog.name;
    oldBlog.html = newBlog.html;

    const result = await oldBlog.save();
    res.status(200);
    res.json({message: "Chỉnh sửa thông tin sản phẩm thành công"});
  } catch (error) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
    next(error)
  }
}


// [PATCH] /api/blogs/:id
BlogController.prototype.restore = async function (req, res, next) {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"] });
    return;
  }

  try {
    const data = await Blog.findOneDeleted({ _id: id });
    const result = await data.restore();
    res.status(200).json({ message: "Khôi phục thành công" });
  } catch (error) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
  }
}

// [DELETE] /api/blogs/:id
BlogController.prototype.delete = async function (req, res, next) {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"] });
    return;
  }

  try {
    const data = await Blog.findOne({ _id: id });
    const result = await data.delete();
    res.status(200).json({ message: "Di chuyển vào thùng rác thành công" });
  } catch (error) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
  }
}

// [DELETE] /api/blogs/:id/force
BlogController.prototype.deleteForce = async function (req, res, next) {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"] });
    return;
  }

  try {
    const data = await Blog.findOneDeleted({ _id: id });
    const result = await data.deleteOne();
    res.status(200).json({ message: "Xóa vĩnh viễn thành công, bạn không thể hoàn tác" });
  } catch (error) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
  }
}


module.exports = new BlogController();

