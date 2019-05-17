const User = require("../models/user");
const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");
const ObjectId = require("mongoose").Types.ObjectId;

exports.userById = async (req, res, next, id) => {
  const user = await User.findById(id).populate("following", "name").populate("followers", "name")

  if (!user) {
    return res.status(400).json({
      error: "User not found"
    });
  }
  user.salt = undefined;
  user.hashed_password = undefined;
  console.log(user);
  req.profile = user; // adds profile object in req with user info
  next();
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("name email created updated");

  res.json(users);
};

exports.getUserById = async (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
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

// Follow Unfollow
exports.addFollowing = async (req, res, next) => {
  await User.findByIdAndUpdate(req.auth._id, {
    $push: { following: ObjectId(req.body.followId) }
  });

  next();
};

exports.addFollower = async (req, res) => {
  const result = await User.findByIdAndUpdate(
    req.body.followId,
    { $push: { followers: ObjectId(req.auth._id) } },
    { new: true }
  )
    .populate("following", "name")
    .populate("followers", "name");

  result.hashed_password = undefined;
  result.salt = undefined;
  result.photo = undefined;
  res.json(result);
};

// remove follow unfollow
exports.removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.auth._id,
    { $pull: { following: ObjectId(req.body.unfollowId) } },
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      next();
    }
  );
};

exports.removeFollower = async (req, res) => {
  const result = await User.findByIdAndUpdate(
    req.body.unfollowId,
    { $pull: { followers: ObjectId(req.auth._id) } },
    { new: true }
  )
    .populate("following", "name")
    .populate("followers", "name");

  result.hashed_password = undefined;
  result.salt = undefined;
  result.photo = undefined;
  res.json(result);
};
