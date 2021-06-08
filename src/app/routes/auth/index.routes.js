const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/auth.controller');


// [GET] /auth/login
router.get("/login", authController.login);

// [GET] /auth/login
router.get("/forgot", authController.forgot);

// [GET] /auth/login
router.get("/reset/:token", authController.reset);




module.exports = router;