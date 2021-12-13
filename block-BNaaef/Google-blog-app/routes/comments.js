var express = require("express");
var router = express.Router();
var Comment = require("../models/Comment");
var Blog = require("../models/Blog");


router.get("/:id/edit", (req, res, next) => {
  var id = req.params.id;
  Comment.findById(id, (err, comment) => {
    if (err) return next(err);
    res.render("editComment", { comment });
  });
});

router.post("/:id", (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, (err, comment) => {
    if (err) return next(err);
    res.redirect("/blogs/" + comment.bookId);
  });
});

router.get("/:id/delete", (req, res, next) => {
  var commentId = req.params.id;
  Comment.findByIdAndRemove(commentId, (err, comment) => {
    if (err) return next(err);
    Blog.findByIdAndUpdate(
      comment.bookId,
      { $pull: { comments: comment._id } },
      (err, blog) => {
        res.redirect("/blogs/" + comment.bookId);
      }
    );
  });
});

module.exports = router;
