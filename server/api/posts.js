const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const Review = require("../models/Review");

//ADD POST localhost:PORT/posts (POST method)
router.post("/", auth, (req, res) => {
  const { company, title, content, mail, salary } = req.body;

  //only logged-in admin can add post
  if (!req.user.isAdmin)
    return res.status(400).json({ msg: "Only admin can add post !" });

  //all fields are required
  if (!company || !title || !content || !mail || !salary)
    return res.status(400).json({ msg: "All fields are required !" });

  const post = new Post({
    company,
    title,
    content,
    mail,
    salary,
    user: req.user._id,
  });
  post.save();
  return res.json({ msg: "Post added successfully !", post });
});

//GET ALL POST
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("reviews.review")
      .populate("user")
      .populate("likes.like");
    return res.json(posts);
  } catch (e) {
    return res.json({ e, msg: "Cannot get posts !" });
  }
});

//GET POST BY ID
router.get("/:id", async (req, res) => {
  try {
    let post = await Post.findById({ _id: req.params.id })
      .populate("reviews.review")
      .populate("user");

    return res.json(post);
  } catch (e) {
    return res.json({ e, msg: "Cannot get post !" });
  }
});

//UPDATE A POST
router.put("/:id", auth, async (req, res) => {
  //only logged-in admin can update post
  if (!req.user.isAdmin)
    return res.status(400).json({ msg: "Only admin can update post !" });

  try {
    let currentPost = await Post.findById(req.params.id);

    if (!currentPost) return res.json({ msg: "No post found !" });

    if (currentPost.user != req.user._id)
      return res.status(401).json({ msg: "Unauthorized !" });

    let post = await Post.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date().toISOString() },
      {
        new: true,
      }
    );
    return res.json({ msg: "Post updated successfully !", post });
  } catch (e) {
    return res.json({ e, msg: "Cannot update post !" });
  }
});

//DELETE A POST
router.delete("/:id", auth, async (req, res) => {
  //only logged-in admin can delete post
  if (!req.user.isAdmin)
    return res.status(400).json({ msg: "Only admin can delete post !" });

  try {
    let post = await Post.findById(req.params.id);

    if (!post) return res.json({ msg: "Post not found !" });

    if (post.user != req.user._id) return res.json({ msg: "Unauthorized !" });

    let deletedPost = await Post.findByIdAndDelete(req.params.id);

    return res.json({ msg: "Post deleted successfully !", deletedPost });
  } catch (e) {
    return res.json({ e, msg: "Cannot delete post !" });
  }
});

module.exports = router;
