const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const auth = require("../middleware/auth");
const Post = require("../models/Post");
const mongoose = require("mongoose");


router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find();
    return res.json(reviews);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

// ADD
router.post("/:postId", auth, async (req, res) => {
  if (req.user.isAdmin) {
    return res
      .status(401)
      .json({ msg: "Admin users cannot review on the job !" });
  }
  let currentReview = await Review.findOne({
    user: req.user._id,
    post: req.params.postId,
  });

  if (currentReview)
    return res
      .status(400)
      .json({ msg: "You already reviewed on this job !" });

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.json({ msg: "This post doesn't exist !" });
    }

    let review = new Review({
      content: req.body.content,
      post: req.params.postId,
      user: req.user._id,
    });

    if (!review.content)
      return res.status(400).json({ msg: "This field is required !" });

    review.save();
    return res.json({ msg: "Review added successfully !" });
  } catch (e) {
    return res.status(401).json({ e, msg: "Cannot review on this post !" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.json({ msg: "No review found !" });
    const review = await Review.findById(req.params.id);
    if (review.user != req.user._id)
      return res.json({ msg: "Unauthorized !" });

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.json({ msg: "Review updated successfully !", updatedReview });
  } catch (e) {
    return res.json({ error: e });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.json({ msg: "This review doesn't exist!" });
    }

    let review = await Review.findById(req.params.id);

    if (review.user != req.user._id && req.user.role !== "admin") {
      return res.json({ msg: "Unauthorized!" });
    }

    let deletedReview = await Review.findByIdAndDelete(req.params.id);

    return res.json({
      msg: "Review deleted successfully!",
      deletedReview,
    });
  } catch (e) {
    return res.json({ e, msg: "Cannot delete review!" });
  }
});

module.exports = router;
