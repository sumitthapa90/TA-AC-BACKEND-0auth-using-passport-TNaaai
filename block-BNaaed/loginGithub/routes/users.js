var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  console.log(req.session, req.user);
  res.render("users");
});

module.exports = router;
