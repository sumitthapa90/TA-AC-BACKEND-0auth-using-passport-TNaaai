var express = require("express");
var router = express.Router();
var passport = require("passport");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/success", (req, res) => {
  res.render("success");
});

router.get("/failure", (req, res) => {
  res.render("failure");
});

// github

router.get("/auth/github", passport.authenticate("github"));

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/failure" }),
  function (req, res) {
    res.redirect("/success");
  }
);

// google

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/failure" }),
  function (req, res) {
    res.redirect("/success");
  }
);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

//logout

router.get("/success/logout", (req, res) => {
  console.log(req.session);
  req.session.destroy();
  res.clearCookie("connect-sid");
  res.redirect("/");
});

module.exports = router;
