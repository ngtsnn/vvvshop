const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("sites/dashboard/blogs/index");
});

router.get("/add", (req, res, next) => {
  res.render("sites/dashboard/blogs/add");
});

router.get("/edit", (req, res, next) => {
  res.render("sites/dashboard/blogs/edit");
})

module.exports = router;