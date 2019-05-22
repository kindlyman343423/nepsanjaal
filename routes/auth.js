const express = require("express");
const {
  signup,
  signin,
  signout,
  socialLogin,
  forgotPassword
} = require("../controllers/auth");

const { userById } = require("../controllers/user");
const { userSignupValidator } = require("../validator");

const router = express.Router();

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

router.post("/social-login", socialLogin);

router.put("/forgot-password", forgotPassword);

// any route containing :userId, our app will first execute userByID()
router.param("userId", userById);

module.exports = router;
