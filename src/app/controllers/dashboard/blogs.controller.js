"use strict";
const Blog = require("../../models/blog.model");
const User = require("../../models/user.model");
const validator = require("validator");
const {ConvertObjects, ConvertObject} = require("../../../utility/functions/mongoose");



const BlogController = function () {
  
}


// [GET] /dashboard/blogs
BlogController.prototype.index = async function (req, res, next) {
  try {
    let data = await Blog.find({}).populate({
      path: 'author',
      select: 'name',
    });
    const deletes = await Blog.findDeleted({});
    data = ConvertObjects(data);
    
    res.status(200).render("sites/dashboard/blogs/index", {
      blogs: data,
      trashbinCount: deletes.length,
    });
  } catch (error) {
    res.status(500).redirect('/500');
  }
}

// [GET] /dashboard/blogs/trashbin
BlogController.prototype.trashbin = async function (req, res, next) {

  try {
    let data = await Blog.find({}).select(['name', 'author', 'updatedAt', 'slug']).populate({
      path: "users",
      select: "name",
    });
    const publishes = await Blog.find({});
    console.log(data)


    data = ConvertObjects(data);
    
    res.status(200).render("sites/dashboard/blogs/trashbin", {
      blogs: data,
      publishesCount: publishes.length,
    });
  } catch (error) {
    res.status(500).redirect('/500');
  }
}

// [GET] /dashboard/blogs/add
BlogController.prototype.add = async function (req, res, next) {

  try {
    let users = await User.find({}).select(['name']);
    
    users = ConvertObjects(users);
    
    res.status(200).render("sites/dashboard/blogs/add", {
      users,
    });
  } catch (error) {
    res.status(500).redirect('/500');
  }
}

// [GET] /dashboard/blogs/edit
BlogController.prototype.edit = async function (req, res, next) {

  const {slug} = req.params;

  try {
    let blogs = await Blog.findOne({slug});
    let users = await User.find({}).select(['name']);
    
    users = ConvertObjects(users);
    blogs = ConvertObject(blogs);
    
    res.status(200).render("sites/dashboard/blogs/edit", {
      users,
      blogs,
    });
  } catch (error) {
    res.status(500).redirect('/500');
    next(error)
  }
}


module.exports = new BlogController();

