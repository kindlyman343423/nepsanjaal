const Post = require("../models/Post");

exports.getPosts = (req, res) => {
  res.json({
    posts: [{ title: "First post" }, { title: "Second post" }]
  });
};

exports.createPost = async (req, res) => {
  const post = new Post(req.body);

  const savedpost = await post.save();

  res.status(200).json({
    post: savedpost
  });

};
