var express = require("express");
var router = express.Router();

var Blog = require("../models/Blog");
var Comment = require("../models/Comment");
var auth = require("../middlewere/auth");

/* GET home page. */
router.get("/", function (req, res, next) {
  Blog.find({}, (err, blogs) => {
    if (err) return next(err);
    res.render("blogs", { blogs });
  });
});

router.get("/new", auth.loggedInUser, (req, res) => {
  res.render("newBlog");
});

router.get("/:id", (req, res, next) => {
  var id = req.params.id;
  Blog.findById(id)
    .populate("comments")
    .exec((err, blog) => {
      console.log(err, blog);
      if (err) return next(err);
      res.render("singleBlog", { blog });
    });
});

router.use(auth.loggedInUser);

router.post("/", (req, res, next) => {
  req.body.tags = req.body.tags.trim().split(" ");
  Blog.create(req.body, (err, createBlog) => {
    if (err) return next(err);
    res.redirect("/blogs");
  });
});

// router.get("/:id", (req, res, next) => {
//   var id = req.params.id;
//   Blog.findById(id, (err, blog) => {
//     if (err) return next(err);
//     res.render("singleBlog", { blog });
//   });
// });

// router.get("/:id", (req, res, next) => {
//   var id = req.params.id;
//   Blog.findById(id, (err, blog) => {
//     if (err) return next(err);
//     Comment.find({ bookId: id }, (err, comments) => {
//       res.render("singleBlog", { blog, comments });
//     });
//   });
// });

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

router.get("/:id/delete", (req, res, next) => {
  var id = req.params.id;
  Blog.findByIdAndDelete(id, (err, blog) => {
    if (err) return next(err);
    Comment.deleteMany({ bookId: blog.id }, (err, info) => {
      if (err) return next(err);
      res.redirect("/blogs");
    });
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

//comments

router.post("/:id/comments", (req, res, next) => {
  var id = req.params.id;
  req.body.bookId = id;
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err);
    Blog.findByIdAndUpdate(
      id,
      { $push: { comments: comment._id } },
      (err, updatedBlog) => {
        if (err) return next(err);
        res.redirect("/blogs/" + id);
      }
    );
  });
});

module.exports = router;
