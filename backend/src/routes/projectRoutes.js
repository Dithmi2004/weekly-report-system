const express = require("express");

const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  assignMember,
  getMembers,
  getMyProjects,
} = require("../controllers/projectController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const {
  projectValidator,
  assignMemberValidator,
} = require("../validators/projectValidator");

const router = express.Router();

router.get("/", authenticateUser, getProjects);

router.get("/my-projects", authenticateUser, getMyProjects);

router.post(
  "/",
  authenticateUser,
  authorizeRoles("MANAGER"),
  projectValidator,
  createProject
);

router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("MANAGER"),
  projectValidator,
  updateProject
);

router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("MANAGER"),
  deleteProject
);

router.post(
  "/:id/members",
  authenticateUser,
  authorizeRoles("MANAGER"),
  assignMemberValidator,
  assignMember
);

router.get(
  "/:id/members",
  authenticateUser,
  authorizeRoles("MANAGER"),
  getMembers
);

module.exports = router;