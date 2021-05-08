const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("sites/dashboard/products/index");
});

module.exports = router;