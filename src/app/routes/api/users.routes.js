const router = require("express").Router();
const userController = require("../../controllers/api/user.controller");
const { verify, isSuperAdmin } = require("../../../utility/middlewares/app/verify.middleware");



// getOne
router.get("/:id", verify, userController.getOne);

// get
router.get("/", verify, userController.get);

// addAdmin
router.post("/admin", isSuperAdmin, userController.addAdmin);

// put
router.put("/:id", verify, userController.put);

// patch
router.patch("/to-user/:id", isSuperAdmin, userController.toUser);

module.exports = router;