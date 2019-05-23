const User = require("../models/user");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const { sendEmail } = require("../helpers");

exports.signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists)
    return res.status(403).json({
      error: "Email is taken!"
    });
  const user = await new User(req.body);
  await user.save();
  res.status(200).json({ message: "Signup success! Please login." });
};

exports.signin = async (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // if err or no user
  if (!user) {
    return res.status(401).json({
      error: "User with that email does not exist."
    });
  }
  // if user is found make sure the email and password match
  // create authenticate method in model and use here
  if (!user.authenticate(password)) {
    return res.status(401).json({
      error: "Email and password do not match"
    });
  }
  // generate a token with user id and secret
  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
  // persist the token as 't' in cookie with expiry date
  res.cookie("t", token, { expire: new Date() + 9999 });
  // retrun response with user and token to frontend client

  const { _id, email: mail, name, role } = user;
  return res.json({ token, user: { _id, mail, name, role } });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Successfully signed out" });
};

exports.requireSignin = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const user = parseToken(token);

    const founduser = await User.findById(user._id).select("name");

    if (founduser) {
      req.auth = founduser;
      next();
    } else res.status(401).json({ error: "Not authorized" });
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
};

function parseToken(token) {
  try {
    // For cookie
    //   jwt.verify(token.split(";")[1].split("=")[1], process.env.JWT_SECRET)
    return jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
  } catch (err) {
    return Error({ error: err.message });
  }
}

exports.hasAuthorization = (req, res, next) => {
  let sameUser = req.profile && req.auth && req.profile._id.toString() === req.auth._id.toString();
  let adminUser = req.profile && req.auth && req.auth.role === "admin";

  const authorized = sameUser || adminUser;
  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized to perform this action"
    });
  }
  next();
};

exports.isPoster = (req, res, next) => {
  let sameUser = req.post && req.auth && req.post.postedBy._id.toString() === req.auth._id.toString();
  let adminUser = req.post && req.auth && req.auth.role === "admin";

  let isPoster = sameUser || adminUser;

  if (!isPoster) {
    return res.status(403).json({
      error: "User is not authorized to perform this action"
    });
  }
  next();
};

exports.socialLogin = async (req, res) => {
  // try signup by finding user with req.email
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    // create a new user and login
    user = new User(req.body);
    req.profile = user;
    user.save();
    // generate a token with user id and secret
    const token = jwt.sign(
      { _id: user._id, iss: "NODEAPI" },
      process.env.JWT_SECRET
    );
    res.cookie("t", token, { expire: new Date() + 9999 });
    // return response with user and token to frontend client
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, name, email } });
  } else {
    // update existing user with new social info and login
    req.profile = user;
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.save();
    // generate a token with user id and secret
    const token = jwt.sign(
      { _id: user._id, iss: "NODEAPI" },
      process.env.JWT_SECRET
    );
    res.cookie("t", token, { expire: new Date() + 9999 });
    // return response with user and token to frontend client
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, name, email } });
  }
};

exports.forgotPassword = async (req, res) => {
  if (!req.body) return res.status(400).json({ message: "No request body" });
  if (!req.body.email)
    return res.status(400).json({ message: "No Email in request body" });

  const { email } = req.body;
  // find the user based on email
  const user = await User.findOne({ email });
  // if err or no user
  if (!user)
    return res.status("401").json({
      error: "User with that email does not exist!"
    });

  // generate a token with user id and secret
  const token = jwt.sign(
    { _id: user._id, iss: "NODEAPI" },
    process.env.JWT_SECRET
  );

  // email data
  const emailData = {
    from: "noreply@nepsanjaal.com",
    to: email,
    subject: "Password Reset Instructions",
    text: `Please use the following link to reset your password: ${
      process.env.CLIENT_URL
    }/reset-password/${token}`,
    html: `<p>Please use the following link to reset your password:</p> <p>${
      process.env.CLIENT_URL
    }/reset-password/${token}</p>`
  };

  return user.updateOne({ resetPasswordLink: token }, (err, success) => {
    if (err) {
      return res.json({ message: err });
    } else {
      sendEmail(emailData);
      return res.status(200).json({
        message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
      });
    }
  });
};

exports.resetPassword = async (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  let user = await User.findOne({ resetPasswordLink });
  // if err or no user
  if (!user)
    return res.status(401).json({
      error: "Invalid Link!"
    });

  const updatedFields = {
    password: newPassword,
    resetPasswordLink: ""
  };

  user = _.extend(user, updatedFields);
  user.updated = Date.now();

  user.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    res.json({
      message: `Great! Now you can login with your new password.`
    });
  });
};
