const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

async function main() {
  const password = await bcrypt.hash("123456", 10);

  // Warden
  const warden = await prisma.user.create({
    data: {
      name: "Dr. Meena",
      email: "warden@hostel.com",
      password,
      role: "WARDEN"
    }
  });

  // Students
  const student1 = await prisma.user.create({
    data: {
      name: "Priya S",
      email: "priya@gmail.com",
      password,
      role: "STUDENT",
      roomNumber: "204",
      hostelBlock: "Block A"
    }
  });

  const student2 = await prisma.user.create({
    data: {
      name: "Kavya R",
      email: "kavya@gmail.com",
      password,
      role: "STUDENT",
      roomNumber: "312",
      hostelBlock: "Block A"
    }
  });

  // Complaints
  await prisma.complaint.createMany({
    data: [
      {
        title: "Fan not working",
        description: "Fan stopped in room 204",
        category: "Electricity",
        status: "IN_PROGRESS",
        studentId: student1.id
      },
      {
        title: "Water issue",
        description: "No water pressure",
        category: "Water",
        status: "PENDING",
        studentId: student2.id
      }
    ]
  });

  // Bills
  await prisma.bill.create({
    data: {
      studentId: student1.id,
      month: "April",
      year: 2026,
      amount: 1800,
      status: "UNPAID",
      dueDate: new Date("2026-04-30")
    }
  });

  console.log("✅ Real data inserted");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());