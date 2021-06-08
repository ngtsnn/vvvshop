const router = require("express").Router();
const blogController = require("../../controllers/api/blogs.controller");
const { isAdmin } = require("../../../utility/middlewares/app/verify.middleware");



// getOne
router.get("/:id", blogController.getOne);

// get
router.get("/", blogController.get);

// post
router.post("/", isAdmin, blogController.post);

module.exports = router;