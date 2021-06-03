const router = require("express").Router();
const productControllers = require("../../controllers/api/products.controller");
const { isAdmin } = require("../../../utility/middlewares/app/verify.middleware");


// get by categories
router.get("/categories/*", productControllers.getByCate);

// getOne
router.get("/:id", productControllers.getOne);

// get
router.get("/", productControllers.get);

// post
router.post("/", isAdmin, productControllers.post);

module.exports = router;