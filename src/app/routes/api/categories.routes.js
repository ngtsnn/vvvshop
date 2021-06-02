'use strict';

const router = require("express").Router();
const categoryController = require("../../controllers/api/categories.controller");
const { isAdmin } = require("../../../utility/middlewares/app/verify.middleware");


// get
router.get("/", categoryController.get);
// get
router.get("/:id", categoryController.getOne);

// post
router.post("/", isAdmin, categoryController.post);

module.exports = router;