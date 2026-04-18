const prisma = require("../../config/db");

// STUDENT: get all posts
async function getCommunityPosts(req, res) {
  try {
    const posts = await prisma.communityPost.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            roomNumber: true,
          },
        },
        room: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch community posts",
      error: error.message,
    });
  }
}

// STUDENT: create post
async function createCommunityPost(req, res) {
  try {
    const userId = req.user.id;
    const { content, roomId, isAnonymous = false } = req.body;

    if (!content || !roomId) {
      return res.status(400).json({
        success: false,
        message: "content and roomId are required",
      });
    }

    const post = await prisma.communityPost.create({
      data: {
        content,
        roomId,
        userId,
        isAnonymous,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
}

// STUDENT: get rooms
async function getCommunityRooms(req, res) {
  try {
    const rooms = await prisma.communityRoom.findMany({
      orderBy: { name: "asc" },
    });

    return res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch community rooms",
      error: error.message,
    });
  }
}

module.exports = {
  getCommunityPosts,
  createCommunityPost,
  getCommunityRooms,
};