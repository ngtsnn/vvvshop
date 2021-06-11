const router = require("express").Router();
const orderController = require("../../controllers/api/orders.controller");
const { verify, isAdmin } = require("../../../utility/middlewares/app/verify.middleware");



// getOne
router.get("/:id", verify, orderController.getOne);

// get
router.get("/", verify, orderController.get);

// post
router.post("/", verify, orderController.post);

// set deliver status
router.patch("/deliver/:id", isAdmin, orderController.deliver);

module.exports = router;