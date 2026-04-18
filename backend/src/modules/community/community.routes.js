const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const {
  getCommunityPosts,
  createCommunityPost,
  getCommunityRooms,
} = require("./community.controller");

router.get("/posts", authMiddleware, roleMiddleware("STUDENT"), getCommunityPosts);
router.post("/posts", authMiddleware, roleMiddleware("STUDENT"), createCommunityPost);
router.get("/rooms", authMiddleware, roleMiddleware("STUDENT"), getCommunityRooms);

module.exports = router;