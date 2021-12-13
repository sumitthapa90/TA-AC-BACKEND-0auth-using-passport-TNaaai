var express = require("express");
var router = express.Router();
// var auth = require("../middlewere/auth");
var passport = require("passport");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/protected", (req, res) => {
  res.render("protected");
});

router.get("/success", (req, res) => {
  res.render("success");
});

router.get("/failure", (req, res) => {
  res.render("failure");
});

//github

router.get("/auth/github", passport.authenticate("github"));

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/failure" }),
  function (req, res) {
    res.redirect("/blogs");
  }
);

//google

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/failure" }),
  function (req, res) {
    res.redirect("/blogs");
  }
);
module.exports = router;
