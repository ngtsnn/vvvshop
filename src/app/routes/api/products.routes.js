const router = require("express").Router();
const productControllers = require("../../controllers/api/products.controller");
const { isAdmin } = require("../../../utility/middlewares/app/verify.middleware");



// get
router.get("/", productControllers.get);

// post
router.post("/", isAdmin, productControllers.post);

module.exports = router;