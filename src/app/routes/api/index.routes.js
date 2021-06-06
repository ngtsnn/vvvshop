const router = require("express").Router();
const productsRoutes = require("./products.routes");
const authRoutes = require("./auth.routes");
const suppliersRoutes = require("./suppliers.routes");
const categoriesRoutes = require("./categories.routes");
const blogsRoutes = require("./blogs.routes");
const ordersRoutes = require("./orders.routes");


router.use("/products", productsRoutes);
router.use("/auth", authRoutes);
router.use("/suppliers", suppliersRoutes);
router.use("/categories", categoriesRoutes);
router.use("/blogs", blogsRoutes);
router.use("/orders", ordersRoutes);


module.exports = router;
