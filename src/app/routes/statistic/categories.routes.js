const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("sites/statistic/categories");
});

module.exports = router;