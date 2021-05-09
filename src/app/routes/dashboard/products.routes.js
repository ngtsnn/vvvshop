const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("sites/dashboard/products/index");
});

router.get("/trashbin", (req, res, next) => {
  res.render("sites/dashboard/products/trashbin");
});

module.exports = router;