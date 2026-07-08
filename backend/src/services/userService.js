const bcrypt = require("bcrypt");
const db = require("../config/database");

const getUserProfileById = async (userId) => {
  const [users] = await db.query(
    `SELECT id, first_name, last_name, email, role, created_at
     FROM users
     WHERE id = ?`,
    [userId]
  );

  if (users.length === 0) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const user = users[0];

  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    role: user.role,
    createdAt: user.created_at,
  };
};

const getTeamMembers = async () => {
  const [users] = await db.query(
    `SELECT id, first_name, last_name, email, role, created_at
     FROM users
     WHERE role = 'TEAM_MEMBER'
     ORDER BY first_name ASC, last_name ASC`
  );

  return users.map((user) => ({
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    role: user.role,
    createdAt: user.created_at,
  }));
};

const getUsers = async () => {
  const [users] = await db.query(
    `SELECT id, first_name, last_name, email, role, created_at
     FROM users
     ORDER BY created_at DESC`
  );

  return users.map((user) => ({
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    role: user.role,
    createdAt: user.created_at,
  }));
};

const createUser = async ({ firstName, lastName, email, password, role }) => {
  const [existingUsers] = await db.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existingUsers.length > 0) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const userRole = ["TEAM_MEMBER", "MANAGER"].includes(role)
    ? role
    : "TEAM_MEMBER";
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await db.query(
    `INSERT INTO users
     (first_name, last_name, email, password, role)
     VALUES (?, ?, ?, ?, ?)`,
    [firstName, lastName, email, hashedPassword, userRole]
  );

  return {
    id: result.insertId,
    firstName,
    lastName,
    email,
    role: userRole,
  };
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const [users] = await db.query("SELECT id, password FROM users WHERE id = ?", [
    userId,
  ]);

  if (users.length === 0) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    users[0].password
  );

  if (!isPasswordValid) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.query("UPDATE users SET password = ? WHERE id = ?", [
    hashedPassword,
    userId,
  ]);

  return true;
};

module.exports = {
  getUserProfileById,
  getTeamMembers,
  getUsers,
  createUser,
  changePassword,
};
