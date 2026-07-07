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

module.exports = {
  getUserProfileById,
};