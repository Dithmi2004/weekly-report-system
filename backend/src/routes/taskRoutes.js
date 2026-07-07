const express = require("express");

const {
  createTask,
  getTasks,
  getTaskById,
  getMyTasks,
  updateTask,
  updateMyTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const {
  taskValidator,
  taskStatusValidator,
} = require("../validators/taskValidator");

const router = express.Router();

router.get("/", authenticateUser, getTasks);
router.get("/my-tasks", authenticateUser, getMyTasks);
router.get("/:id", authenticateUser, getTaskById);

router.patch(
  "/:id/status",
  authenticateUser,
  taskStatusValidator,
  updateMyTaskStatus,
);

router.post(
  "/",
  authenticateUser,
  authorizeRoles("MANAGER"),
  taskValidator,
  createTask,
);

router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("MANAGER"),
  taskValidator,
  updateTask,
);

router.delete("/:id", authenticateUser, authorizeRoles("MANAGER"), deleteTask);

module.exports = router;
