const express = require('express');
const router = express.Router();
const ordersController = require('../../../app/controllers/statistic/orders.controller');

// index
router.get("/", ordersController.index);

// detail
router.get("/:id", ordersController.detail);

module.exports = router;