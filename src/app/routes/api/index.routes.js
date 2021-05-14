const router = require("express").Router();
const productsRoutes = require("./products.routes");
const authRoutes = require("./auth.routes");


router.use("/products", productsRoutes);
router.use("/auth", authRoutes);


module.exports = router;
