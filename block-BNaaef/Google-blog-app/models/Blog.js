var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var blogSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    tags: [String],
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId }],
    author: { type: String },
  },
  { timestamps: true }
);

var Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
