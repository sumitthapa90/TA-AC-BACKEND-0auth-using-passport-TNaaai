var express = require("express");
var router = express.Router();

var User = require("../models/User");

router.get("/", function (req, res, next) {
  console.log(req.session, req.user);
  res.render("users");
});

router.get("/register", function (req, res, next) {
  res.render("register");
});

router.post("/register", (req, res, next) => {
  User.create(req.body, (err, user) => {
    console.log(err, user);
    if (err) return next(err);
    res.redirect("/users/login");
  });
});

router.get("/login", function (req, res, next) {
  var error = req.flash("error")[0];
  res.render("login", { error });
});

router.post("/login", (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "Email/password required");
    return res.redirect("/users/login");
  }
  //   find One
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.redirect("/users/login");
    }
    //compare
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        return res.redirect("/users/login");
      }
      req.session.userId = user.id;
      res.redirect("/users");
    });
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/users/login");
});

module.exports = router;
