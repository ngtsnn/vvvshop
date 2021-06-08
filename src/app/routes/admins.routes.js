const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("sites/admin/index");
});

router.get("/edit", (req, res, next) => {
  res.render("sites/admin/edit");
});

router.get("/add", (req, res, next) => {
  res.render("sites/admin/add");
});

module.exports = router;