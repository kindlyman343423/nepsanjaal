const Post = require("../models/Post");
const formidable = require("formidable");
const fs = require("fs");

exports.getPosts = async (req, res) => {
  const posts = await Post.find().select("_id title body");

  res.json({ posts });
};

// exports.createPost = async (req, res) => {
//   const post = new Post(req.body);

//   const savedpost = await post.save();

//   res.status(200).json({
//     post: savedpost
//   });
// };

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
