const express = require("express");
const { userById, getAllUsers, getUserById, updateUserById } = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/user/:userId", requireSignin, getUserById);
router.put("/user/:userId", requireSignin, updateUserById);

// any route containing :userId, our app will first execute userByID()
router.param("userId", userById);

module.exports = router;