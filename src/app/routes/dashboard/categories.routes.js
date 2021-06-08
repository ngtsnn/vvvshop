const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("sites/dashboard/categories/index");
});

router.get("/add", (req, res, next) => {
  res.render("sites/dashboard/categories/add");
});

router.get("/edit", (req, res, next) => {
  res.render("sites/dashboard/categories/edit");
})


module.exports = router;