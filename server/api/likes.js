const express = require("express");
const router = express.Router();
const Like = require("../models/Like");
const auth = require("../middleware/auth");
const Post = require("../models/Post");
const mongoose = require("mongoose");
router.post("/:postId", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.postId))
      return res.json({ msg: "No post to show" });
    let post = await Post.findById(req.params.postId);
    let likedPost = await Like.findOne({
      user: req.user._id,
      post: post._id,
    });
    if (!likedPost) {
      let liker = new Like({
        user: req.user._id,
        post: req.params.postId,
      });
      liker.save();
      post.likes.push({ like: liker._id });
      post.save();
      return res.json({ msg: "Liked post!" });
    } else {
      await Like.findByIdAndDelete(likedPost._id);
      await Post.findByIdAndUpdate(
        { _id: req.params.postId },
        {
          $pull: { likes: { like: likedPost._id } },
        }
      );
      return res.json({ msg: "Unliked post" });
    }
  } catch (e) {
    return res.status(400).json({ e, msg: "Cannot like post" });
  }
});

//get the likes of a post
router.get("/", async (req, res) => {
  try {
    const likes = await Like.find()
      .populate("user")
    return res.json(likes);
  } catch (e) {
    return res.json({ e, msg: "Cannot get likes !" });
  }
});

module.exports = router;









