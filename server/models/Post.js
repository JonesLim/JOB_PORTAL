const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  company: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  mail: { type: String, required: true },
  salary: { type: Number, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      review: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
      _id: false,
    },
  ],

  likes: [
    {
      like: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like",
      },
      _id: false,
    },
  ],

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now() },
});
module.exports = mongoose.model("Post", PostSchema, "posts");
