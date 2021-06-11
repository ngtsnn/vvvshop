const express = require('express');
const router = express.Router();
const productRoutes = require("./products.routes");
const blogRoutes = require("./blogs.routes");
const categoryRoutes = require("./categories.routes");
const supplierRoutes = require("./suppliers.routes");



router.use("/products", productRoutes);
router.use("/blogs", blogRoutes);
router.use("/categories", categoryRoutes);
router.use("/suppliers", supplierRoutes);



router.get("/", (req, res, next) => {
  res.redirect("/dashboard/products");
});

router.get("/", (req, res, next) => {
  res.redirect("/dashboard/blogs");
});

router.get("/", (req, res, next) => {
  res.redirect("/dashboard/categories");
});

router.get("/", (req, res, next) => {
  res.redirect("/dashboard/suppliers");
});

module.exports = router;