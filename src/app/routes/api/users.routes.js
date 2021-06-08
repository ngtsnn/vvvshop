const router = require("express").Router();
const userController = require("../../controllers/api/user.controller");
const { verify } = require("../../../utility/middlewares/app/verify.middleware");



// getOne
router.get("/:id", verify, userController.getOne);

// get
router.get("/", verify, userController.get);

// put
router.put("/:id", verify, userController.put);

module.exports = router;