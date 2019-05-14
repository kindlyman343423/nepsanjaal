const User = require("../models/user");
const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");

exports.userById = async (req, res, next, id) => {
  const user = await User.findById(id).select("email name created updated photo");

  if (!user) {
    return res.status(400).json({
      error: "User not found"
    });
  }
  req.profile = user; // adds profile object in req with user info
  next();
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("name email created updated");

  res.json(users);
};

exports.getUserById = async (req, res) => {
  console.log(req.profile._id == req.auth._id);
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  console.log(req.profile);
  return res.json(req.profile);
};

exports.updateUserById = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      });
    }
    // save user
    let user = req.profile;
    user = _.extend(user, fields);
    user.updated = Date.now();

    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    });
  });
};

exports.userPhoto = (req, res, next) => {
  console.log(req.profile)
  if (req.profile.photo.data) {
    res.set(("Content-Type", req.profile.photo.contentType));
    return res.send(req.profile.photo.data);
  }
  next();
};

exports.deleteUser = async (req, res) => {
  let user = req.profile;
  await user.remove();
  res.json({ message: "User deleted successfully" });
};
