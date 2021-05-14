const router = require("express").Router();
const productControllers = require("../../controllers/api/products.controller");


// get
router.get("/", productControllers.get);

// post
router.post("/", productControllers.post);

module.exports = router;