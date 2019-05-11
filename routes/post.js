const express = require("express");
const {getPosts, createPost, postByUser, postById, getPostByPostId, deletePostById} = require("../controllers/post");
const {requireSignin, isPoster} = require("../controllers/auth");
const {userById} = require("../controllers/user");
const {createPostValidator} = require("../validator");

const router = express.Router();

router.get("/", getPosts);
router.post("/post", requireSignin, createPost, createPostValidator);
router.get("/post/:postId", requireSignin, getPostByPostId);
router.get("/posts/by/:userId", requireSignin, postByUser);
router.delete("/post/:postId", requireSignin, isPoster, deletePostById);

// any route containing :userId, our app will first execute userByID()
router.param("userId", userById);

// any route containing :postId, our app will first execute postByID()
router.param("postId", postById);

module.exports = router;
