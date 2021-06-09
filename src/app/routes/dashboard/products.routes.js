const express = require('express');
const router = express.Router();
const productController = require('../../controllers/dashboard/products.controller');

router.get("/", productController.index);

router.get("/trashbin", productController.trashbin);

router.get("/add", (req, res, next) => {
  res.render("sites/dashboard/products/add");
})

router.get("/edit", (req, res, next) => {
  res.render("sites/dashboard/products/edit");
})

module.exports = router;