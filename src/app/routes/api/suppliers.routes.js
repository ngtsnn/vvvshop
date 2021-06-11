'use strict';

const router = require("express").Router();
const supplierController = require("../../controllers/api/suppliers.controller");
const { isAdmin } = require("../../../utility/middlewares/app/verify.middleware");


// get
router.get("/", supplierController.get);

// get
router.get("/:id", supplierController.getOne);

// post
router.post("/", isAdmin, supplierController.post);

// put
router.put("/:id", supplierController.put);

module.exports = router;