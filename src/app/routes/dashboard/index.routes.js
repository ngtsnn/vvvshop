const express = require('express');
const router = express.Router();
const productRoutes = require("./products.routes");

router.use("/products", productRoutes);

router.get("/", (req, res, next) => {
  res.redirect("/dashboard/products");
});

module.exports = router;