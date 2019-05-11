const express = require("express");
const { userById, getAllUsers } = require("../controllers/user");

const router = express.Router();

router.get("/users", getAllUsers);

// any route containing :userId, our app will first execute userByID()
router.param("userId", userById);

module.exports = router;