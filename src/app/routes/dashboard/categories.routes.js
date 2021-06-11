const express = require('express');
const router = express.Router();

const CategoryController = require('../../controllers/dashboard/categories.controller');

router.get("/", CategoryController.index);

// router.get("/trashbin", CategoryController.trashbin);

// router.get("/add", CategoryController.add)

router.get("/*", CategoryController.edit)

module.exports = router;