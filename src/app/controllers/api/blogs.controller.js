"use strict";
const Blog = require("../../models/blog.model");
const User = require("../../models/user.model");
const validator = require("validator");


const BlogController = function () {
  
}


// [GET] /api/blogs
BlogController.prototype.get = async function (req, res, next) {
  
  let hasPagination = false, perPage, page;
  console.log(req.query);

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

  // check images[]
  newBlog.images.forEach((img, index) => {
    if (!validator.isURL(img, {
      require_protocol: true,
      require_valid_protocol: true,
      allow_underscores: true,
    })){
      errs.push(`ảnh thứ ${index + 1} không đúng định dạng!`);
    }
  });

  // check properties
  if (!newBlog.paragraphs || !newBlog.paragraphs.length){
    errs.push("Bài viết ít nhất phải có 1 đoạn!");
  } else {
    newBlog.paragraphs.forEach((para, index) => {
      if (!para){
        errs.push(`đoạn thứ ${index + 1} đang bị trống!`);
      }
    });
  }

  // save as author
  newBlog.author = req.user._id;

  try {
    const result = await newBlog.save();
    res.status(200);
    res.json(result);
  } catch (error) {
    res.status(500).json({errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"]});
    next(error)
  }
}



module.exports = new BlogController();

