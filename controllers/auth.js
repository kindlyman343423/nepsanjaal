const User = require("../models/user");
const jwt = require("jsonwebtoken");

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
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  // persist the token as 't' in cookie with expiry date
  res.cookie("t", token, { expire: new Date() + 9999 });
  // retrun response with user and token to frontend client

  const { _id, email: mail, name } = user;
  return res.json({ token, user: { _id, mail, name } });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Successfully signed out" });
};

exports.requireSignin = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const user = parseToken(token);

    const founduser = await User.findById(user._id);

    if (founduser) {
      res.locals.user = user;
      next();
    } else res.status(401).json("Not authorized");
  } else {
    res.status(401).json("Not authorized");
  }
};

function parseToken(token) {
  // For cookie
  //   jwt.verify(token.split(";")[1].split("=")[1], process.env.JWT_SECRET)
  return jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
}
