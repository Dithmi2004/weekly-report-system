const notificationService = require("../services/notificationService");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const getMyNotifications = asyncHandler(async (req, res) => {
  const [notifications, unreadCount] = await Promise.all([
    notificationService.getMyNotifications(req.user.id),
    notificationService.getUnreadCount(req.user.id),
  ]);

  return successResponse(res, "Notifications fetched successfully", {
    notifications,
    unreadCount,
  });
});

const markMyNotificationsRead = asyncHandler(async (req, res) => {
  const unreadCount = await notificationService.markAllAsRead(req.user.id);

  return successResponse(res, "Notifications marked as read", {
    unreadCount,
  });
});

module.exports = {
  getMyNotifications,
  markMyNotificationsRead,
};
