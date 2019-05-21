const Post = require("../models/Post");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

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
    .select("title body created likes comments")
    .sort({ created: -1 });

  res.json(posts);
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
    .select("title body created likes")
    .populate("postedBy", "name")
    .sort({ created: -1 });

  res.json(posts);
};

exports.getPostByPostId = async (req, res) => {
  res.json(req.post);
};

exports.updatePostById = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      });
    }
    // save post
    let post = req.post;
    post = _.extend(post, fields);
    post.updated = Date.now();

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }

    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json(post);
    });
  });
};

exports.deletePostById = async (req, res) => {
  let post = req.post;
  await post.remove();
  res.json({ message: "Post deleted successfully" });
};

exports.photo = (req, res, next) => {
  res.set("Content-Type", req.post.photo.contentType);
  return res.send(req.post.photo.data);
};

exports.like = async (req, res) => {
  const result = await Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { likes: req.auth._id } },
    { new: true }
  );
  result.photo = undefined;
  res.json(result);
};

exports.unlike = async (req, res) => {
  const result = await Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { likes: req.auth._id } },
    { new: true }
  );
  result.photo = undefined;
  res.json(result);
};

exports.comment = async (req, res) => {
  let comment = req.body.comment;
  comment.postedBy = req.auth._id;

  const result = await Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { comments: comment } },
    { new: true }
  )
    .populate("comments.postedBy", "name")
    .populate("postedBy", "name");

  result.photo = undefined;

  res.json(result);
};

exports.uncomment = async (req, res) => {
  let comment = req.body.comment;

  const result = await Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { comments: { _id: comment._id } } },
    { new: true }
  )
    .populate("comments.postedBy", "name")
    .populate("postedBy", "name");

  result.photo = undefined;

  res.json(result);
};
