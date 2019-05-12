const User = require("../models/user");
const _ = require("lodash");

exports.userById = async (req, res, next, id) => {
  const user = await User.findById(id).select("email name created updated");

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
  console.log(req.profile)
  return res.json(req.profile);
};

exports.updateUserById = async (req, res) => {
  let user = req.profile;
  user = _.extend(user, req.body); // extend - mutate the source object
  user.updated = Date.now();
  user.save(err => {
    if (err) {
      return res.status(400).json({
        error: "You are not authorized to perform this action"
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json({ user });
  });
};

exports.deleteUser = async (req, res) => {
  let user = req.profile;
  await user.remove();
  res.json({ message: "User deleted successfully" });
};