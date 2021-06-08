const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/auth.controller');


// [GET] /auth/login
router.get("/login", authController.login);




module.exports = router;