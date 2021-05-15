const express = require('express');
const router = express.Router();
const incomeRoutes = require("./income.routes");
const orderRoutes = require("./orders.routes");
const categoryRoutes = require("./categories.routes");


router.use("/income", incomeRoutes);
router.use("/orders", orderRoutes);
router.use("/categories", categoryRoutes);


router.get("/", (req, res, next) => {
  res.redirect("/statistic/income");
});

router.get("/", (req, res, next) => {
  res.redirect("/statistic/orders");
});

router.get("/", (req, res, next) => {
  res.redirect("/statistic/categories");
});


module.exports = router;