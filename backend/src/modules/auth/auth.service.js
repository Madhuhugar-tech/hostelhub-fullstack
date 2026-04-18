const bcrypt = require("bcryptjs");
const prisma = require("../../config/db");
const generateToken = require("../../utils/generateToken");

async function loginUser({ email, password, role }) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new Error("Invalid password");
  }

  if (role && user.role !== role.toUpperCase()) {
    throw new Error("Role mismatch");
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      roomNumber: user.roomNumber,
      hostelBlock: user.hostelBlock,
    },
  };
}

async function getCurrentUser(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      roomNumber: true,
      hostelBlock: true,
      createdAt: true,
    },
  });
}

module.exports = {
  loginUser,
  getCurrentUser,
};