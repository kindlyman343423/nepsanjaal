const Post = require("../models/Post");

exports.getPosts = async (req, res) => {
  console.log(req.auth, req.profile)
  const posts = await Post.find().select("_id title body");

  res.json({ posts });
};

exports.createPost = async (req, res) => {
  const post = new Post(req.body);

  const savedpost = await post.save();

  res.status(200).json({
    post: savedpost
  });
};
