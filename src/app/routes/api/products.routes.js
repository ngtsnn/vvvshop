const router = require("express").Router();
const productControllers = require("../../controllers/api/products.controller");
const { isAdmin, isSuperAdmin } = require("../../../utility/middlewares/app/verify.middleware");


// get by supplier
router.get("/supplier/:slug", productControllers.getBySupplier);

// get by categories
router.get("/categories/*", productControllers.getByCate);

// getOne
router.get("/:id", productControllers.getOne);

// get
router.get("/", productControllers.get);

// post
router.post("/", isAdmin, productControllers.post);

// post
router.put("/:id", isAdmin, productControllers.put);

// restore
router.patch("/restore/:id", isAdmin, productControllers.restore);

// delete
router.delete("/:id", isAdmin, productControllers.delete);

// delete
router.delete("/:id/force", isSuperAdmin, productControllers.deleteForce);

module.exports = router;