const prisma = require("../../config/db");

// STUDENT dashboard
async function getStudentDashboard(req, res) {
  try {
    const userId = req.user.id;

    const student = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        roomNumber: true,
        hostelBlock: true,
        role: true,
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const totalComplaints = await prisma.complaint.count({
      where: { studentId: userId },
    });

    const pendingComplaints = await prisma.complaint.count({
      where: {
        studentId: userId,
        status: {
          in: ["PENDING", "IN_PROGRESS", "ESCALATED"],
        },
      },
    });

    const unpaidBills = await prisma.bill.count({
      where: {
        studentId: userId,
        status: "UNPAID",
      },
    });

    const recentComplaints = await prisma.complaint.findMany({
      where: { studentId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      dashboard: {
        student,
        stats: {
          totalComplaints,
          pendingComplaints,
          unpaidBills,
        },
        recentComplaints,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load student dashboard",
      error: error.message,
    });
  }
}

// WARDEN dashboard
async function getWardenDashboard(req, res) {
  try {
    const pendingIssues = await prisma.complaint.count({
      where: { status: "PENDING" },
    });

    const inProgress = await prisma.complaint.count({
      where: { status: "IN_PROGRESS" },
    });

    const escalated = await prisma.complaint.count({
      where: { status: "ESCALATED" },
    });

    const resolvedThisMonth = await prisma.complaint.count({
      where: {
        status: "RESOLVED",
        resolvedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const unpaidBills = await prisma.bill.count({
      where: { status: "UNPAID" },
    });

    const totalComplaints = await prisma.complaint.count();

    const electricityCount = await prisma.complaint.count({
      where: { category: "Electricity" },
    });

    const waterCount = await prisma.complaint.count({
      where: { category: "Water" },
    });

    const foodCount = await prisma.complaint.count({
      where: { category: "Food" },
    });

    const sanitationCount = await prisma.complaint.count({
      where: { category: "Sanitation" },
    });

    const calcPercent = (count) =>
      totalComplaints === 0 ? 0 : Math.round((count / totalComplaints) * 100);

    return res.status(200).json({
      success: true,
      dashboard: {
        stats: {
          pendingIssues,
          inProgress,
          escalated,
          resolvedThisMonth,
          unpaidBills,
        },
        breakdown: {
          Electricity: calcPercent(electricityCount),
          Water: calcPercent(waterCount),
          Food: calcPercent(foodCount),
          Sanitation: calcPercent(sanitationCount),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load warden dashboard",
      error: error.message,
    });
  }
}

module.exports = {
  getStudentDashboard,
  getWardenDashboard,
};