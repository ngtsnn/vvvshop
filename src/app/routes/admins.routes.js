const express = require('express');
const router = express.Router();
const adminsController = require("../controllers/admins.controller");

router.get("/", adminsController.index);

router.get("/profile/:id", adminsController.profile);

router.get("/add", (req, res, next) => {
  res.render("sites/admin/add");
});

module.exports = router;