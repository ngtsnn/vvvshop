const router = require("express").Router();
const blogController = require("../../controllers/api/blogs.controller");
const { isAdmin, isSuperAdmin } = require("../../../utility/middlewares/app/verify.middleware");



// getOne
router.get("/:id", blogController.getOne);

// get
router.get("/", blogController.get);

// post
router.post("/", isAdmin, blogController.post);

// post
router.put("/:id", isAdmin, blogController.put);

// restore
router.patch("/restore/:id", isAdmin, blogController.restore);

// delete
router.delete("/:id", isAdmin, blogController.delete);

// delete
router.delete("/:id/force", isSuperAdmin, blogController.deleteForce);


module.exports = router;