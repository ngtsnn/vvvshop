const express = require('express');
const router = express.Router();
const productRoutes = require("./products.routes");
const blogRoutes = require("./blogs.routes");
const categoryRoutes = require("./categories.routes");


router.use("/products", productRoutes);
router.use("/blogs", blogRoutes);
router.use("/categories", categoryRoutes);


router.get("/", (req, res, next) => {
  res.redirect("/dashboard/products");
});

router.get("/", (req, res, next) => {
  res.redirect("/dashboard/blogs");
});

router.get("/", (req, res, next) => {
  res.redirect("/dashboard/categories");
});


module.exports = router;