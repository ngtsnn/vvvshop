const router = require("express").Router();
const orderController = require("../../controllers/api/orders.controllers");
const { verify } = require("../../../utility/middlewares/app/verify.middleware");



// getOne
router.get("/:id", orderController.getOne);

// get
router.get("/", orderController.get);

// post
router.post("/", verify, orderController.post);

module.exports = router;