const express = require("express");
const router = express.Router();

const authRoutes = require("../modules/auth/auth.routes");
const dashboardRoutes = require("../modules/dashboard/dashboard.routes");
const complaintRoutes = require("../modules/complaints/complaints.routes");
const billRoutes = require("../modules/bills/bills.routes");
const communityRoutes = require("../modules/community/community.routes");

router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/complaints", complaintRoutes);
router.use("/bills", billRoutes);
router.use("/community", communityRoutes);

module.exports = router;