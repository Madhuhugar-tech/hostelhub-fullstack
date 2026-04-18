const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
} = require("./complaints.controller");

// STUDENT
router.post("/", authMiddleware, roleMiddleware("STUDENT"), createComplaint);
router.get("/my", authMiddleware, roleMiddleware("STUDENT"), getMyComplaints);

// WARDEN
router.get("/all", authMiddleware, roleMiddleware("WARDEN"), getAllComplaints);
router.put("/:id/status", authMiddleware, roleMiddleware("WARDEN"), updateComplaintStatus);

module.exports = router;