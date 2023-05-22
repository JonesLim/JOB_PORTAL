const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  content: { type: String, required: true },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", ReviewSchema, "reviews");
