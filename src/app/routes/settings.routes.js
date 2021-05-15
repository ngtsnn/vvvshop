const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("sites/setting/index");
});


module.exports = router;