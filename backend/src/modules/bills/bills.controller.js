const prisma = require("../../config/db");

// STUDENT: get own bills
async function getMyBills(req, res) {
  try {
    const userId = req.user.id;

    const bills = await prisma.bill.findMany({
      where: { studentId: userId },
      orderBy: [{ year: "desc" }, { dueDate: "desc" }],
    });

    return res.status(200).json({
      success: true,
      bills,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bills",
      error: error.message,
    });
  }
}

// WARDEN: get unpaid bills
async function getUnpaidBills(req, res) {
  try {
    const bills = await prisma.bill.findMany({
      where: { status: "UNPAID" },
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
      orderBy: { dueDate: "asc" },
    });

    return res.status(200).json({
      success: true,
      bills,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch unpaid bills",
      error: error.message,
    });
  }
}

// WARDEN: generate bills for all students
async function generateBillsForAll(req, res) {
  try {
    const { month, year, amount, dueDate } = req.body;

    if (!month || !year || !amount || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "month, year, amount and dueDate are required",
      });
    }

    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true },
    });

    const createdBills = [];

    for (const student of students) {
      const existing = await prisma.bill.findFirst({
        where: {
          studentId: student.id,
          month,
          year: Number(year),
        },
      });

      if (!existing) {
        const bill = await prisma.bill.create({
          data: {
            studentId: student.id,
            month,
            year: Number(year),
            amount: Number(amount),
            status: "UNPAID",
            dueDate: new Date(dueDate),
          },
        });

        createdBills.push(bill);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Bills generated successfully",
      count: createdBills.length,
      bills: createdBills,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate bills",
      error: error.message,
    });
  }
}

module.exports = {
  getMyBills,
  getUnpaidBills,
  generateBillsForAll,
};