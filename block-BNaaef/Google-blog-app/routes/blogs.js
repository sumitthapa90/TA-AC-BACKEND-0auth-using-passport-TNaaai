var express = require("express");
var router = express.Router();

var Blog = require("../models/Blog");

/* GET home page. */
router.get("/", function (req, res, next) {
  Blog.find({}, (err, blogs) => {
    if (err) return next(err);
    res.render("blogs", { blogs });
  });
});

router.get("/new", (req, res) => {
  res.render("newBlog");
});

router.post("/", (req, res, next) => {
  req.body.tags = req.body.tags.trim().split(" ");
  Blog.create(req.body, (err, createBlog) => {
    if (err) return next(err);
    res.redirect("/blogs");
  });
});

router.get("/:id", (req, res, next) => {
  var id = req.params.id;
  Blog.findById(id, (err, blog) => {
    if (err) return next(err);
    res.render("singleBlog", { blog });
  });
});

router.get("/:id/edit", (req, res, next) => {
  var id = req.params.id;
  Blog.findById(id, (err, blog) => {
    if (err) return next(err);
    res.render("editBlog", { blog });
  });
});

router.post("/:id", (req, res, next) => {
  var id = req.params.id;
  Blog.findByIdAndUpdate(id, req.body, (err, blog) => {
    if (err) return next(err);
    res.redirect("/blogs/" + id);
  });
});

router.get("/:id/delete", (req, res) => {
  var id = req.params.id;
  Blog.findByIdAndDelete(id, (err, blog) => {
    if (err) return next(err);
    res.redirect("/blogs");
  });
});

router.get("/:id/likes", (req, res, next) => {
  var id = req.params.id;
  Blog.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, blog) => {
    if (err) return next(err);
    res.redirect("/blogs/" + id);
  });
});

router.get("/:id/dislikes", (req, res, next) => {
  var id = req.params.id;
  Blog.findByIdAndUpdate(id, { $inc: { dislikes: -1 } }, (err, blog) => {
    if (err) return next(err);
    res.redirect("/blogs/" + id);
  });
});
module.exports = router;
