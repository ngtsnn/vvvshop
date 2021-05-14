const router = require("express").Router();
const authController = require("../../controllers/api/auth.controller");



// login
router.post("/login", authController.login);

// sign up
router.post("/register", authController.register);

module.exports = router;