const express = require('express');
const router = express.Router();

const supplierController = require('../../controllers/dashboard/suppliers.controller');

router.get("/", supplierController.index);

// router.get("/trashbin", supplierController.trashbin);

// router.get("/add", supplierController.add)

router.get("/:slug", supplierController.edit);

module.exports = router;