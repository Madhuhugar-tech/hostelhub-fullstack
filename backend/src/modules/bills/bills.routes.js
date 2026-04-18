const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const {
  getMyBills,
  getUnpaidBills,
  generateBillsForAll,
} = require("./bills.controller");

// STUDENT
router.get("/my", authMiddleware, roleMiddleware("STUDENT"), getMyBills);

// WARDEN
router.get("/unpaid", authMiddleware, roleMiddleware("WARDEN"), getUnpaidBills);
router.post("/generate", authMiddleware, roleMiddleware("WARDEN"), generateBillsForAll);

module.exports = router;