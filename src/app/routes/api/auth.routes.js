const router = require("express").Router();
const { verify } = require("../../../utility/middlewares/app/verify.middleware");
const authController = require("../../controllers/api/auth.controller");





// login
router.post("/login", authController.login);

// sign up
router.post("/register", authController.register);

// reset password
router.get("/forgot/:email", authController.forgot);

// reset password
router.patch("/reset/:id", verify, authController.resetPassword);

module.exports = router;