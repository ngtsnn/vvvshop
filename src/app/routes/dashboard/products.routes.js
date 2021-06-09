const express = require('express');
const router = express.Router();
const productController = require('../../controllers/dashboard/products.controller');

router.get("/", productController.index);

router.get("/trashbin", productController.trashbin);

router.get("/add", productController.add)

router.get("/edit/:slug", productController.edit)

module.exports = router;