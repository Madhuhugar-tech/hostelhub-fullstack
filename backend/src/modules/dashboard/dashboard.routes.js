const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const {
  getStudentDashboard,
  getWardenDashboard,
} = require("./dashboard.controller");

router.get("/student", authMiddleware, roleMiddleware("STUDENT"), getStudentDashboard);
router.get("/warden", authMiddleware, roleMiddleware("WARDEN"), getWardenDashboard);

module.exports = router;