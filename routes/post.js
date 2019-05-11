const express = require("express");
const {getPosts, createPost} = require("../controllers/post");
const {requireSignin} = require("../controllers/auth");
const validator = require("../validator");

const router = express.Router();


router.get("/",requireSignin, getPosts);
router.post("/post", validator.createPostValidator, createPost);

module.exports = router;
