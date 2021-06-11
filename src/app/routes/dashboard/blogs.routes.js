const express = require('express');
const router = express.Router();

const blogController = require('../../controllers/dashboard/blogs.controller');

router.get("/", blogController.index);

router.get("/trashbin", blogController.trashbin);

router.get("/add", blogController.add)

router.get("/edit/:slug", blogController.edit)

module.exports = router;