const prisma = require("../../config/db");

// STUDENT: create complaint
async function createComplaint(req, res) {
  try {
    const userId = req.user.id;
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description and category are required",
      });
    }

    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        category,
        status: "PENDING",
        studentId: userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      complaint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create complaint",
      error: error.message,
    });
  }
}

// STUDENT: get own complaints
async function getMyComplaints(req, res) {
  try {
    const userId = req.user.id;

    const complaints = await prisma.complaint.findMany({
      where: { studentId: userId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      complaints,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaints",
      error: error.message,
    });
  }
}

// WARDEN: get all complaints
async function getAllComplaints(req, res) {
  try {
    const complaints = await prisma.complaint.findMany({
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            roomNumber: true,
            hostelBlock: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      complaints,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaints",
      error: error.message,
    });
  }
}

// WARDEN: update complaint status
async function updateComplaintStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["PENDING", "IN_PROGRESS", "RESOLVED", "ESCALATED"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const existingComplaint = await prisma.complaint.findUnique({
      where: { id },
    });

    if (!existingComplaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: {
        status,
        resolvedAt: status === "RESOLVED" ? new Date() : null,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            roomNumber: true,
            hostelBlock: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update complaint status",
      error: error.message,
    });
  }
}

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
};