const Post = require("../models/Post");
const formidable = require("formidable");
const fs = require("fs");

exports.postById = async (req, res, next, id) => {
  const post = await Post.findById(id).populate("postedBy", "name");
  if (!post) {
    return res.status(400).json({
      error: "Post not found"
    });
  }
  req.post = post; // adds post object in req with post info
  next();
};

exports.getPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("postedBy", "name")
    .select("_id title body");

  res.json({ posts });
};

exports.createPost = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      });
    }

    let post = new Post(fields);

    post.postedBy = req.auth;

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    const result = await post.save();
    res.json(result);
  });
};

exports.postByUser = async (req, res) => {
  const posts = await Post.find({ postedBy: req.profile._id })
    .populate("postedBy", "name")
    .sort({ created: -1 });
  res.json({ posts });
};

exports.getPostByPostId = async (req, res) =>{
  res.json(req.post);
}

exports.deletePostById = async (req, res) => {
  let post = req.post;
  await post.remove();
  res.json({ message: "Post deleted successfully" });
};