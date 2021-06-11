"use strict";
const Category = require("../../models/category.model");
const validator = require("validator");
const {ConvertObjects, ConvertObject} = require("../../../utility/functions/mongoose");



const CategoryController = function () {
  
}


// [GET] /dashboard/categories
CategoryController.prototype.index = async function (req, res, next) {

  try {
    let data = await Category.find({}).select(['name', 'logo', 'parent', 'slug']);
    const deletes = await Category.findDeleted({});
    
    data = ConvertObjects(data);
    
    res.status(200).render("sites/dashboard/categories/index", {
      categories: data,
      trashbinCount: deletes.length,
    });
  } catch (error) {
    res.status(500).redirect('/500');
  }
}



module.exports = new CategoryController();

