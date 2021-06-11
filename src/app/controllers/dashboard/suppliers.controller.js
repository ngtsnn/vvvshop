"use strict";
const Supplier = require("../../models/supplier.model");
const validator = require("validator");
const { ConvertObjects, ConvertObject } = require("../../../utility/functions/mongoose");



const SupplierController = function () {

}


// [GET] /dashboard/suppliers
SupplierController.prototype.index = async function (req, res, next) {

  try {
    let data = await Supplier.find({}).select(['name', 'image', 'createdAt', 'slug']);
    const deletes = await Supplier.findDeleted({});

    data = ConvertObjects(data);

    res.status(200).render("sites/dashboard/suppliers/index", {
      suppliers: data,
      trashbinCount: deletes.length,
    });
  } catch (error) {
    res.status(500).redirect('/500');
  }
}

// [GET] /dashboard/suppliers/:slug
SupplierController.prototype.edit = async function (req, res, next) {

  const { slug } = req.params;

  try {
    let data = await Supplier.findOne({ slug }).select(['name', 'image']);

    data = ConvertObject(data);

    res.status(200).render("sites/dashboard/suppliers/edit", {
      supplier: data,
    });
  } catch (error) {
    res.status(500).redirect('/500');
  }
}



module.exports = new SupplierController();

