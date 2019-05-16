const express = require("express");
const {
  userById,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUser,
  userPhoto,
  addFollower,
  addFollowing,
  removeFollower,
  removeFollowing
} = require("../controllers/user");
const { requireSignin, hasAuthorization } = require("../controllers/auth");

const router = express.Router();

router.get("/users", getAllUsers);

router.get("/user/photo/:userId", userPhoto);

router.put("/user/follow", requireSignin, addFollowing, addFollower);
router.put("/user/unfollow", requireSignin, removeFollowing, removeFollower);

router
  .route("/user/:userId")
  .get(requireSignin, getUserById)
  .put(requireSignin, hasAuthorization, updateUserById)
  .delete(requireSignin, hasAuthorization, deleteUser);

// any route containing :userId, our app will first execute userByID()
router.param("userId", userById);

module.exports = router;
