const db = require("../config/database");

const createNotification = async ({
  userId,
  title,
  message,
  type = "INFO",
  link = null,
}) => {
  const [result] = await db.query(
    `INSERT INTO notifications
     (user_id, title, message, type, link)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, title, message, type, link],
  );

  return result.insertId;
};

const createNotificationsForUsers = async (userIds, notification) => {
  const uniqueUserIds = [...new Set(userIds.filter(Boolean))];

  for (const userId of uniqueUserIds) {
    await createNotification({
      ...notification,
      userId,
    });
  }
};

const notifyManagers = async (notification) => {
  const [managers] = await db.query(
    `SELECT id
     FROM users
     WHERE role = 'MANAGER'`,
  );

  await createNotificationsForUsers(
    managers.map((manager) => manager.id),
    notification,
  );
};

const getMyNotifications = async (userId) => {
  const [notifications] = await db.query(
    `SELECT
       id,
       title,
       message,
       type,
       link,
       is_read AS isRead,
       created_at AS createdAt,
       read_at AS readAt
     FROM notifications
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 50`,
    [userId],
  );

  return notifications;
};

const getUnreadCount = async (userId) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS unreadCount
     FROM notifications
     WHERE user_id = ?
       AND is_read = 0`,
    [userId],
  );

  return Number(rows[0].unreadCount) || 0;
};

const markAllAsRead = async (userId) => {
  await db.query(
    `UPDATE notifications
     SET is_read = 1,
         read_at = COALESCE(read_at, NOW())
     WHERE user_id = ?
       AND is_read = 0`,
    [userId],
  );

  return getUnreadCount(userId);
};

module.exports = {
  createNotification,
  createNotificationsForUsers,
  notifyManagers,
  getMyNotifications,
  getUnreadCount,
  markAllAsRead,
};
