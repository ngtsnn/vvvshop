"use strict";
const Category = require("../../models/category.model");
const validator = require("validator");
const { ConvertObjects, ConvertObject } = require("../../../utility/functions/mongoose");



const CategoryController = function () {

}


// [GET] /dashboard/categories
CategoryController.prototype.index = async function (req, res, next) {

  try {
    let data = await Category.find({}).select(['name', 'logo', 'parent', 'slug', 'tree']);
    const deletes = await Category.findDeleted({});

    data = ConvertObjects(data);
    const parents = data.filter(d => d.parent === "");

    res.status(200).render("sites/dashboard/categories/index", {
      categories: data,
      parents,
      trashbinCount: deletes.length,
    });
  } catch (error) {
    res.status(500).redirect('/500');
  }
}

// [GET] /dashboard/categories/:slug
CategoryController.prototype.edit = async function (req, res, next) {

  const slug  = req.params[0];

  try {
    let data = await Category.find({}).select(['name', 'logo', 'parent', 'slug', 'tree']);
    let category = await Category.findOne({ slug });

    data = ConvertObjects(data);
    data = data.filter(d => d.parent === "");
    category = ConvertObject(category);

    res.status(200).render("sites/dashboard/categories/edit", {
      parents: data,
      category,
    });
  } catch (error) {
    res.status(500).redirect('/500');
  }
}



module.exports = new CategoryController();

