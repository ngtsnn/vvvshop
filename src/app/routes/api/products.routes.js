const router = require("express").Router();
const productControllers = require("../../controllers/api/products.controller");
const {verify} = require("../../../utility/middlewares/app/verify.middleware");



// get
router.get("/", productControllers.get);

// post
router.post("/", verify, productControllers.post);

module.exports = router;